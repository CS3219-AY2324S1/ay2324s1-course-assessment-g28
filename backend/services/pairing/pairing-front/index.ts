import { IncomingMessage, request } from "http";
import url from "url";
import { WebSocketServer, WebSocket } from "ws";
import amqp from "amqplib";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();
const RABBITMQ_URL = process.env.RABBITMQ_URL!;
const PORT = Number(process.env.PORT!);

function getErrorResponse(req: IncomingMessage) {
  let params = url.parse(req.url!, true).query;

  const is_user_specified = params.user;
  const is_complexity_specified = Number(params.complexity) != null;
  const is_question_specified = Number(params.question) != null;

  if (
    !is_user_specified ||
    (!is_complexity_specified && !is_question_specified)
  ) {
    const msg = JSON.stringify({
      status: 400,
      data: {
        message: "Bad request",
      },
    });
    return msg;
  }

  return null;
}

function getWsCallback(rmq_conn: amqp.Connection) {
  async function callback(ws: WebSocket, req: IncomingMessage) {
    let params = url.parse(req.url!, true).query;

    const errorResponse = getErrorResponse(req);
    if (errorResponse) {
      ws.send(errorResponse);
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
      channel.close();
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
                otherUser: content.otherUser,
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
        question: Number(params.question),
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
      callback(ws, req);
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
