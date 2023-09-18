import { IncomingMessage } from "http";
import url from "url";
import { WebSocketServer, WebSocket } from "ws";
import amqp from "amqplib/callback_api";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();
const RABBITMQ_URL = process.env.RABBITMQ_URL!;

console.log(`Connected to ${RABBITMQ_URL}`);

amqp.connect(RABBITMQ_URL, function (error0, rmq_connection) {
  if (error0) {
    throw error0;
  }

  const wss = new WebSocketServer({ port: 8080, path: "/pairing" });

  wss.on(
    "connection",
    function connection(ws: WebSocket, req: IncomingMessage) {
      let params = url.parse(req.url!, true).query;

      if (!params.user) {
        ws.send("Invalid request");
        ws.close();
        return;
      }

      let uuid = uuidv4();

      rmq_connection.createChannel(function (error1, channel) {
        if (error1) {
          console.log(error1);
          ws.send("Internal server error");
          ws.close();
          return;
        }

        var exchange = "pairingResponses";
        channel.assertExchange(exchange, "direct", {
          durable: false,
        });

        channel.assertQueue(
          "",
          {
            exclusive: true,
          },
          function (error2, q) {
            if (error2) {
              console.log(error2);
              ws.send("Internal server error");
              ws.close();
              return;
            }

            channel.bindQueue(q.queue, exchange, uuid);

            channel.consume(q.queue, function (msg) {
              ws.send(msg!.content.toString());
            });
          }
        );

        var workQueue = "pairingRequests";
        channel.assertQueue(workQueue, {
          durable: false,
        });

        var msg = {
          id: uuid,
          data: {
            user: params.user!,
          },
        };
        channel.sendToQueue(workQueue, Buffer.from(JSON.stringify(msg)));
        console.log(`Sent ${JSON.stringify(msg)}`);

        ws.send("Queueing for match...");
      });

      ws.on("error", console.error);
    }
  );
});
