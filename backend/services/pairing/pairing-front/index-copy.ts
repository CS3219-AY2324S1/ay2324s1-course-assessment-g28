import { IncomingMessage, request } from "http";
import url from "url";
import { WebSocketServer, WebSocket } from "ws";
import amqp from "amqplib";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();
const RABBITMQ_URL = process.env.RABBITMQ_URL!;

function getWsCallback(rmq_conn: amqp.Connection) {
  return async (ws: WebSocket, req: IncomingMessage) => {
    let params = url.parse(req.url!, true).query;
    if (!params.user) {
      ws.send("Invalid request");
      ws.close();
      return;
    }

    let channel = await rmq_conn.createChannel();
    let [request_queue, cancel_queue, return_queue] = await Promise.all([
      channel.assertQueue("pairing_requests", {
        durable: false,
      }),
      channel.assertQueue("pairing_cancels", { durable: true }),
      channel.assertQueue("", { exclusive: true }),
    ]);

    let correlationId = uuidv4();

    ws.on("close", () => {
      channel.sendToQueue(cancel_queue.queue, Buffer.from(JSON.stringify({})), {
        correlationId,
      });
    });

    await channel.consume(return_queue.queue, function (msg) {
      console.log(JSON.parse(msg!.content.toString()));
      if (msg?.properties.correlationId == correlationId) {
        ws.send(msg!.content);
      }
    });

    var msg = {
      user: params.user,
    };
    channel.sendToQueue(request_queue.queue, Buffer.from(JSON.stringify(msg)), {
      correlationId,
      replyTo: request_queue.queue,
    });

    console.log(`Sent ${JSON.stringify(msg)}`);
    let reply = {
      data: "Queuing for match...",
    };
    ws.send(JSON.stringify(reply));

    return;
  };
}

amqp
  .connect(RABBITMQ_URL)
  .then((rmq_conn) => {
    console.log(`Connected to ${RABBITMQ_URL}`);

    const wss = new WebSocketServer({ port: 8080, path: "/pairing" });

    console.log("created wss");

    wss.on("connection", getWsCallback(rmq_conn));
  })
  .catch((error) => {
    throw error;
  });
