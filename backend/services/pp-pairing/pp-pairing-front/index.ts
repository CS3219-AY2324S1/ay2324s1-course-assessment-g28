import { IncomingMessage } from "http";
import url from "url";
import { WebSocketServer, WebSocket } from "ws";
import amqp from "amqplib/callback_api";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();
const RABBITMQ_URL = process.env.RABBITMQ_URL!;

amqp.connect(RABBITMQ_URL, function (error0, rmq_connection) {
  if (error0) {
    throw error0;
  }
  console.log(`Connected to ${RABBITMQ_URL}`);

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

      let correlationId = uuidv4();

      rmq_connection.createChannel(function (error1, channel) {
        if (error1) {
          console.log(error1);
          ws.send("Internal server error");
          ws.close();
          return;
        }

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

            channel.consume(q.queue, function (msg) {
              console.log(JSON.parse(msg!.content.toString()));
              var content = msg!.content.toJSON();
              if (msg?.properties.correlationId == correlationId) {
                ws.send(msg!.content);
              }
            }, {
              noAck: true
            });

            var workQueue = "pairing_requests";
            var msg = {
              user: params.user,
            };
            channel.sendToQueue(workQueue, Buffer.from(JSON.stringify(msg)), {
              correlationId,
              replyTo: q.queue,
            });

            console.log(`Sent ${JSON.stringify(msg)}`);

            let reply = {
              data: "Queuing for match...",
            };
            ws.send(JSON.stringify(reply));
          }
        );
      });

      ws.on("error", console.error);
    }
  );
});
