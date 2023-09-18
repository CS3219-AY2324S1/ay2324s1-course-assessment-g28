import { IncomingMessage } from "http";
import url from "url";
import { WebSocketServer, WebSocket } from "ws";
import amqp from "amqplib/callback_api";
import dotenv from "dotenv";

dotenv.config();
const RABBITMQ_URL = process.env.RABBITMQ_URL!;

console.log(RABBITMQ_URL)

amqp.connect(RABBITMQ_URL, function (error0, rmq_connection) {
  if (error0) {
    throw error0;
  }

  const wss = new WebSocketServer({ port: 8080, path: "/pairing" });

  wss.on(
    "connection",
    function connection(ws: WebSocket, req: IncomingMessage) {
      console.log(url.parse(req.url!, true).query);

      rmq_connection.createChannel(function (error1, channel) {
        if (error1) {
          throw error1;
        }

        var queue = "hello";
        var msg = "Hello world";

        channel.assertQueue(queue, {
          durable: false,
        });

        channel.sendToQueue(queue, Buffer.from(msg));
        console.log(" [x] Sent %s", msg);

        ws.on("message", function message(data) {
          channel.sendToQueue(queue, Buffer.from(data.toString()));
        });
      });

      ws.on("error", console.error);

      ws.send("something");
    }
  );
});
