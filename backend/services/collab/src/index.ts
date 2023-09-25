import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app: Express = express();
app.use(express.json());

/**
 * Initialize environment variables based on environment
 */
if (app.get('env') === 'production') {
  dotenv.config({ path: '.env.production.local' });
} else {
  dotenv.config({ path: '.env.development.local' });
}

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
  origin: process.env.ALLOW_ORIGIN_HEADER, 
  credentials: true,
  optionSuccessStatus: 200,
  exposedHeaders: ["Set-Cookie"],
};

app.use(cors(corsOptions));

/**
 * Initialize cookie settings
 * App will use cookie to obtain player info if player did not login
 */


const cookieParser = require('cookie-parser');
app.use(cookieParser());

/**
 * Initialize MongoDB settings
 */

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error: Error) => console.error(error));
db.once('open', () => console.log('Connected to MongoDB'));

/**
 * Set up the url routes
 */

const pairingRouter = require('./routes/pairing');
app.use('/pairing', pairingRouter);


/**
 * Start server on port
 */
app.listen(process.env.PORT, () => console.log('Server has started on port:', process.env.PORT));

/**
 * Setting up WebSocket
 */

const { WebSocketServer } = require('ws');
const http = require('http');

// Spinning the http server and the WebSocket server.
const server = http.createServer();
const wsServer = new WebSocketServer({ server, path: "/editor" });
const port = process.env.WEBSOCKET_PORT;
server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});

const clients = {};

// A new client connection request received
wsServer.on('connection', function(connection) {
  console.log(`Recieved a new connection.`);

  // Store the new connection and handle messages
  console.log(`${connection} connected.`);
});
