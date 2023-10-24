import amqp from "amqplib";
import { User } from "./src/models/user";
import { List } from "./src/models/linked-list";
import { matchUser, removeUser } from "./src/controllers/user-pairing";
import logger from "./src/utils/logger";
import config from "./src/utils/config";
import getPairingRequestCallback from "./src/channel-callbacks/pairing-request";

function startServer() {
  amqp
    .connect(config.RABBITMQ_URL)
    .then(async (rmq_conn) => {
      logger.info(`Connected to ${config.RABBITMQ_URL}`);

      let userList = new List<User>();

      let channel = await rmq_conn.createChannel();
      let [request_queue, cancel_queue] = await Promise.all([
        channel.assertQueue("pairing_requests", {
          durable: false,
        }),
        channel.assertQueue("pairing_cancels", { durable: true }),
      ]);

      channel.consume(cancel_queue.queue, async (msg) => {
        logger.debug(
          `Received cancel request on queue: {${request_queue.queue}}, with correlationId {${msg?.properties.correlationId}}}`
        );
        channel.ack(msg!);

        removeUser(userList, msg!.properties.correlationId);
      });

      channel.consume(
        request_queue.queue,
        getPairingRequestCallback(channel, request_queue, userList)
      );
    })
    .catch((error) => {
      logger.error(error);
      logger.info(
        `Failed to connect to ${config.RABBITMQ_URL}. Retrying in 5 seconds`
      );
      setTimeout(startServer, 5000);
    });
}

startServer();
