import express, { Express, Request } from "express";
import dotenv from "dotenv";
import { deletePairByPairId, getPairByPairId } from "./services/pairService";
import {
  getQueryParams,
  handleCaretPos,
  handleDefault,
  handleDuplicateSessionError,
  handleError,
  handleExit,
  handleInvalidWsParams,
  handleMessage,
  handleNextQuestionId,
  handleOp,
  handlePairConnected,
  handlePartnerDisconnected,
  handleReadyToReceive,
  handleRunCode,
  handleSwitchLang,
} from "./services/wsService";
import { DEFAULT_EXPIRY_AFTER_EXIT_MS, PairState, WS_METHODS } from "./constants";
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

// Keeps track of whose turn it is in each pair
const pairs: { 
  [pairId: string]: PairState,
} = {};
const expiryTimers: {
  [pairId: string]: NodeJS.Timeout
} = {};

// A new client connection request received
// Query params: ?pairId=<pairId>?userId=<userId>
wsServer.on("connection", function (connection: WebSocket, request: Request) {
  console.log(`=====Recieved a new connection.=====`);

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
      const partnerId =
        userId === pairDoc.user1 ? pairDoc.user2 : pairDoc.user1;
        
      if (!(pairId in pairs)) {
        pairs[pairId] = {
          messages: [],
          language: "Python",
          connectionDetails: {
            [userId]: {
              connection: connection,
              partnerId: partnerId,
            }
          }
        };

        addPairToOt(pairId);

      } else if (!(userId in pairs[pairId].connectionDetails)) {
        pairs[pairId].connectionDetails[userId] = {
          connection: connection,
          partnerId: partnerId
        }
      } else {
        // User already has an active tab for this session
        handleDuplicateSessionError(connection);
        return;
      }

      // // Renew expiry of pair entry
      // setExpiryByPairId(pairId, DEFAULT_EXPIRY_SECONDS);

      clearTimeout(expiryTimers[pairId]);

      console.log("User:", userId, ", Partner:", partnerId);
      console.log("Has partner connected?", partnerId in pairs[pairId].connectionDetails);

      // Inform user that WS is ready for messages
      handleReadyToReceive(connection, userId, pairs[pairId]);

      // Check if partner has already connected
      // If so, send READY to the pair
      if (partnerId in pairs[pairId].connectionDetails) {
        handlePairConnected(
          connection, 
          pairs[pairId].connectionDetails[partnerId].connection, 
          userId, 
          partnerId
        );
      } 
    } else {
      console.log(`User: ${userId} | Pair does not exist: ${pairId}`);
      handleInvalidWsParams(connection);
      connection.close();
    }
  });

  connection.onmessage = (message: any) => {
    const data = JSON.parse(message.data);
    console.log("New Message:::", data);

    if (!(pairId in pairs)) {
      return;
    }

    const pairConnectionDetails = pairs[pairId]?.connectionDetails;
    const partnerId = pairConnectionDetails[userId]?.partnerId;
    const partnerConnection = pairConnectionDetails[partnerId]?.connection;

    try {
      switch (data.method) {
        case WS_METHODS.OP:
          handleOp(connection, partnerConnection, pairId, data);
          break;
        case WS_METHODS.CARET_POS:
          handleCaretPos(connection, partnerConnection, data);
          break;
        case WS_METHODS.SWITCH_LANG:
          pairs[pairId].language = data.language
          handleSwitchLang(connection, partnerConnection, data);
          break;
        case WS_METHODS.RUN_CODE:
          handleRunCode(connection, partnerConnection, data);
          break;
        case WS_METHODS.MESSAGE:
          pairs[pairId].messages.push({
            from: userId,
            message: data.message
          })
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
          if (!(pairId in pairs))
            // Prevents multiple calls of next question
            break;
          delete pairs[pairId];
          handleNextQuestionId(connection, partnerConnection, userId, partnerId, pairId).then(result => {
            // Remove current pair state when moving to next question
            // We will not be using the same WebSocket connection anymore
            removePairFromOt(pairId);
            connection.close();
            partnerConnection.close();
          });
          break;
        case WS_METHODS.NEXT_QUESTION_REJECT:
        case WS_METHODS.EXIT_INITIATED_BY_PEER:
        case WS_METHODS.EXIT_CONFIRM:
        case WS_METHODS.EXIT_REJECT:
        case WS_METHODS.PEER_HAS_EXITED:
          handleDefault(partnerConnection, data.method);
      }
    } catch (error) {
      console.log("!!! AN UNEXPECTED ERROR OCCURRED !!!", error);
      handleError(connection, partnerConnection, error);

      connection.close();
      partnerConnection.close();
    }
  };

  connection.onclose = (message: any) => {
    console.log("Connection closed: ", userId);

    if (pairId in pairs) {
      const pairConnectionDetails = pairs[pairId].connectionDetails;
      
      if (connection !== pairConnectionDetails[userId].connection) {
        // Closing a duplicate tab, not the same session;
        console.log("!!! Closing duplicate session !!!");
        return;
      }
      
      const partnerId = pairConnectionDetails[userId].partnerId;
      const partnerConnection = pairConnectionDetails[partnerId]?.connection;
  
      if (partnerConnection !== undefined && partnerConnection.readyState == partnerConnection.OPEN) {
        // Partner is still connected, inform him of my disconnection
        handlePartnerDisconnected(connection, partnerConnection);
      }
    }

    onCloseCleanup(connection, userId, pairId);
  };
});

/**
 * Should effectively delete everything to allow start over 
 * from clean slate upon reconnection
 * DB entry not deleted but set 1hr expiry as users have not confirm exit yet
 * 
 * @param connection 
 * @param partnerConnection 
 * @param userId 
 * @param partnerId 
 * @param pairId 
 */
async function onCloseCleanup(connection: WebSocket, userId: string, pairId: string) {
  if (!(pairId in pairs)) {
    deletePairState(pairId);
    return;
  }

  const pairConnectionDetails = pairs[pairId].connectionDetails;
  const partnerId = pairConnectionDetails[userId].partnerId;
  delete pairConnectionDetails[userId];

  console.log("Cleaning up data for:", userId);

  // Partner has already left, remove pair
  if (!(partnerId in pairConnectionDetails)) {
    console.log("Partner:", partnerId, "has already left");
    deletePairState(pairId);
  }
}

async function deletePairState(pairId: string) {
  if (pairId in expiryTimers) {
    clearTimeout(expiryTimers[pairId]);
  }

  // Creates a timeout to clear pair state 1hr after pair leaves
  expiryTimers[pairId] = setTimeout(() => {
    console.log("!!! Timeout: Deleting pair permanently !!!");
    delete pairs[pairId];
    removePairFromOt(pairId);
    deletePairByPairId(pairId);
  }, DEFAULT_EXPIRY_AFTER_EXIT_MS);

  // try {
  //   await setExpiryByPairId(pairId, DEFAULT_EXPIRY_AFTER_EXIT_MS);
  // } catch (error) {
  //   console.log("!!! Error while setting expiry !!!", error);
  // }
}