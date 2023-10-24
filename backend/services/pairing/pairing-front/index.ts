import { IncomingMessage, request } from "http";
import url from "url";
import { WebSocketServer, WebSocket } from "ws";
import amqp from "amqplib";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();
const RABBITMQ_URL = process.env.RABBITMQ_URL!;
const PORT = Number(process.env.PORT!);

function getWsCallback(rmq_conn: amqp.Connection) {
  async function callback(ws: WebSocket, req: IncomingMessage) {
    let params = url.parse(req.url!, true).query;

    if (!params.user || Number(params.complexity == null)) {
      const msg = JSON.stringify({
        status: 400,
        data: {
          message: "Bad request",
        },
      });
      ws.send(msg);
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

    const correlationId = uuidv4();

    function cancelPairing() {
      channel.sendToQueue(cancel_queue.queue, Buffer.from(JSON.stringify({})), {
        correlationId,
      });
    }
    ws.on("close", cancelPairing);

    await channel.consume(return_queue.queue, async function (msg) {
      if (msg?.properties.correlationId === correlationId) {
        try {
          let content = JSON.parse(msg.content.toString());
          ws.send(
            JSON.stringify({
              status: 200,
              data: {
                url: content.url,
                questionId: content.questionId,
              },
            })
          );
        } catch (error) {
          console.log(`Failed to parse ${msg}. Closing websocket`);
          ws.close();
        }
      }
      ws.off("close", cancelPairing);
      ws.close();
    });

    console.log(return_queue.queue);

    var msg = {
      match_options: {
        user: params.user,
        complexity: Number(params.complexity),
      },
    };
    channel.sendToQueue(request_queue.queue, Buffer.from(JSON.stringify(msg)), {
      correlationId,
      replyTo: return_queue.queue,
    });

    console.log(`Sent ${JSON.stringify(msg)}`);
    let reply = {
      status: 200,
      data: {
        message: "Queuing for match...",
      },
    };
    ws.send(JSON.stringify(reply));

    return;
  }

  return async (ws: WebSocket, req: IncomingMessage) => {
    try {
      callback;
    } catch (e) {
      console.log(e);
    }
  };
}

function startServer() {
  amqp
    .connect(RABBITMQ_URL)
    .then((rmq_conn) => {
      console.log(`Connected to ${RABBITMQ_URL}`);

      const wss = new WebSocketServer({ port: PORT, path: "/pairing" });

      console.log("created wss");

      wss.on("connection", getWsCallback(rmq_conn));
    })
    .catch((e) => {
      console.log(e);
      console.log("Failed to connect to RabbitMQ. Retrying in 5 seconds.");
      setTimeout(startServer, 5000);
    });
}

startServer();
