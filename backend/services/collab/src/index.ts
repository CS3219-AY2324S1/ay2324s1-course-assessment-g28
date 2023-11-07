import express, { Express, Request } from "express";
import dotenv from "dotenv";
import { getPairAndStoreQuestionId } from "./services/pairService";
import {
  getQueryParams,
  handleCaretPos,
  handleDefault,
  handleExit,
  handleMessage,
  handleOp,
  handleReady,
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
// Query params: ?pairId=<pairId>?userId=<userId>?questionId=<questionId>
wsServer.on("connection", function (connection: WebSocket, request: Request) {
  console.log(`Recieved a new connection.`);

  // Store the new connection and handle messages
  //console.log(`${connection} connected.`);
  //console.log("Client ", client)

  const params = getQueryParams(request.url);
  //console.log("Query params ", params);
  const pairId = params["pairId"];
  const userId = params["userId"];
  const questionId = Number(params["questionId"]);

  //console.log("Pair: ", pairId, "User: ", userId);

  // Check pair exists, else close connection
  getPairAndStoreQuestionId(pairId, userId, questionId).then((pairDoc) => {
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

      // Check if partner has already connected
      // If so, send READY to the pair
      if (partnerId in clients) {
        handleReady(
          connection,
          clients[partnerId],
          userId,
          partnerId,
          currTurnId
        );
      }
    } else {
      console.log("Closing connection for user ", userId);
      connection.close();
    }
  });

  connection.onmessage = (message: any) => {
    const data = JSON.parse(message.data);
    //console.log("New Message:::", data);

    const partnerConnection = clients[partners[userId]];

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
      case WS_METHODS.NEXT_QUESTION_CONFIRM:
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

    // Order of deletion: partners[userId, partnerId], pairs[pairId], clients[userId]
    // Then partnerConnection is also closed which will only delete clients[userId]

    // Close partner connection if it exists
    // Also remove the pair from the OT service
    if (userId in partners) {
      const partnerId = partners[userId];
      if (partnerId in clients) {
        const partnerConnection = clients[partnerId];
        partnerConnection.close();
      }
      delete partners[userId];
      delete partners[partnerId];
      delete pairs[pairId];

      removePairFromOt(pairId);
    }

    delete clients[userId];
  };
});
