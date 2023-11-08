import express, { Express, Request } from "express";
import dotenv from "dotenv";
import { getPairByPairId } from "./services/pairService";
import {
  getQueryParams,
  handleCaretPos,
  handleDefault,
  handleExit,
  handleMessage,
  handleNextQuestionId,
  handleOp,
  handlePairConnected,
  handlePartnerDisconnected,
  handleReadyToReceive,
  handleRunCode,
  handleSwitchLang,
} from "./services/wsService";
import { WS_METHODS } from "./constants";
import { addPairToOt, removePairFromOt } from "./services/otService";
dotenv.config();

const app: Express = express();
app.use(express.json());

/**
 * Initialize environment variables based on environment
 */
// if (app.get('env') === 'production') {
//   dotenv.config({ path: '.env.production.local' });
// } else {
//   dotenv.config({ path: '.env.development.local' });
// }

// Set up rate limiter: maximum of twenty requests per minute
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1000,
});
app.use(limiter);

/**
 * Initialize CORS settings
 */

const cors = require("cors");
const corsOptions = {
  credentials: true,
  optionSuccessStatus: 200,
  exposedHeaders: ["Set-Cookie"],
};

app.use(cors(corsOptions));

/**
 * Initialize cookie settings
 * App will use cookie to obtain player info if player did not login
 */

const cookieParser = require("cookie-parser");
app.use(cookieParser());

/**
 * Initialize MongoDB settings
 */

const mongoose = require("mongoose");
console.log(process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;
db.on("error", (error: Error) => console.error(error));
db.once("open", () => console.log("Connected to MongoDB"));

/**
 * Set up the url routes
 */

const pairingRouter = require("./routes/pairing");
app.use("/pairing", pairingRouter);

/**
 * Start server on port
 */
app.listen(process.env.PORT, () =>
  console.log("Server has started on port:", process.env.PORT)
);

/**
 * Setting up WebSocket
 */

const { WebSocketServer } = require("ws");
const http = require("http");

// Spinning the http server and the WebSocket server.
const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = process.env.WEBSOCKET_PORT;
server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});

// List of user: partner pairs
const partners: { [userId: string]: string } = {};
// List of clients' WebSocket connection
const clients: { [userId: string]: WebSocket } = {};
// Keeps track of whose turn it is in each pair
const pairs: { [pairId: string]: string } = {};

// A new client connection request received
// Query params: ?pairId=<pairId>?userId=<userId>
wsServer.on("connection", function (connection: WebSocket, request: Request) {
  console.log(`Recieved a new connection.`);

  // Store the new connection and handle messages
  //console.log(`${connection} connected.`);
  //console.log("Client ", client)

  const params = getQueryParams(request.url);
  //console.log("Query params ", params);
  const pairId = params["pairId"];
  const userId = params["userId"];

  console.log("Pair: ", pairId, "User: ", userId);

  // Check pair exists, else close connection
  getPairByPairId(pairId, userId).then((pairDoc) => {
    if (pairDoc !== null) {
      if (pairDoc.isUser1Turn) {
        pairs[pairId] = pairDoc.user1;
      } else {
        pairs[pairId] = pairDoc.user2;
      }

      addPairToOt(pairId);

      const partnerId =
        userId === pairDoc.user1 ? pairDoc.user2 : pairDoc.user1;
      const currTurnId = pairDoc.currTurn;

      partners[userId] = partnerId;
      clients[userId] = connection;

      console.log("User:",userId, ", Partner:", partnerId);
      console.log("Has partner connected?", partnerId in clients);

      // Inform user that WS is ready for messages
      handleReadyToReceive(connection);

      // Check if partner has already connected
      // If so, send READY to the pair
      if (partnerId in clients) {
        handlePairConnected(connection, clients[partnerId], userId, partnerId);
      } 
    } else {
      console.log("Closing connection for user ", userId);
      connection.close();
    }
  });

  connection.onmessage = (message: any) => {
    const data = JSON.parse(message.data);
    console.log("New Message:::", data);

    const partnerId = partners[userId];
    const partnerConnection = clients[partnerId];

    switch (data.method) {
      case WS_METHODS.OP:
        handleOp(connection, partnerConnection, pairId, data);
        break;
      case WS_METHODS.CARET_POS:
        handleCaretPos(connection, partnerConnection, data);
        break;
      case WS_METHODS.SWITCH_LANG:
        handleSwitchLang(connection, partnerConnection, data);
        break;
      case WS_METHODS.RUN_CODE:
        handleRunCode(connection, partnerConnection, data);
        break;
      case WS_METHODS.MESSAGE:
        handleMessage(connection, partnerConnection, data);
        break;
      case WS_METHODS.EXIT:
        console.log("EXIT WS .......");
        handleExit(connection, partnerConnection, data);
        break;
      case WS_METHODS.NEXT_QUESTION_INITATED_BY_PEER:
        handleDefault(partnerConnection, data.method);
        break;
      case WS_METHODS.NEXT_QUESTION_CONFIRM:
        handleDefault(partnerConnection, data.method);
        break;
      case WS_METHODS.NEXT_QUESTION_ID:
        handleNextQuestionId(connection, partnerConnection, userId, partnerId, pairId).then(result => {
          handleClosePair(connection, partnerConnection, userId, partnerId, pairId);
        });
        break;
      case WS_METHODS.NEXT_QUESTION_REJECT:
      case WS_METHODS.EXIT_INITIATED_BY_PEER:
      case WS_METHODS.EXIT_CONFIRM:
      case WS_METHODS.EXIT_REJECT:
      case WS_METHODS.PEER_HAS_EXITED:
        handleDefault(partnerConnection, data.method);
    }
  };

  connection.onclose = (message: any) => {
    console.log("Connection closed: ", userId);

    const partnerId = partners[userId];
    const partnerConnection = partnerId === undefined ? undefined : clients[partnerId];

    if (partnerConnection !== undefined && partnerConnection.readyState == partnerConnection.OPEN) {
      handlePartnerDisconnected(connection, partnerConnection);
    }
  };
});

/**
 * Should effectively delete and close everything to allow start over 
 * from clean slate upon reconnection
 * DB entry not deleted but set 1hr expiry as users have not confirm exit yet
 * 
 * @param connection 
 * @param partnerConnection 
 * @param userId 
 * @param partnerId 
 * @param pairId 
 */
function handleCloseConnection(connection: WebSocket, partnerConnection: WebSocket, userId: string, partnerId: string, pairId: string) {
  delete clients[userId];
  delete partners[userId];

  // Partner has also left
  if (partnerId !in clients) {
    // TODO: Add expiry on db entry
    delete pairs[pairId];
    removePairFromOt(pairId);
  }

  connection.close();
}

function handleClosePair(connection: WebSocket, partnerConnection: WebSocket, userId: string, partnerId: string, pairId: string) {
  delete clients[userId];
  delete partners[userId];

  delete clients[partnerId];
  delete partners[partnerId];

  delete pairs[pairId];
  removePairFromOt(pairId);

  connection.close();
  partnerConnection.close();
}