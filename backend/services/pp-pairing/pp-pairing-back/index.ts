import amqp from "amqplib";
import { User } from "./src/models/user";
import { List } from "./src/models/linked-list";
import { matchUser, removeUser } from "./src/controllers/user-pairing";
import MockEditor from "./src/services/editor/mock-editor";
import logger from "./src/utils/logger";
import config from "./src/utils/config";

amqp.connect(config.RABBITMQ_URL).then(async (rmq_conn) => {
  logger.info(`Connected to ${config.RABBITMQ_URL}`);

  let editorService = new MockEditor();
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

  channel.consume(request_queue.queue, async (msg) => {
    logger.debug(
      `Received pairing request on queue: {${
        request_queue.queue
      }}, with content {${msg?.content.toString()}, with correlationId {${
        msg?.properties.correlationId
      }}}`
    );

    let content = JSON.parse(msg!.content.toString());
    let user = new User(
      {
        replyTo: msg!.properties.replyTo,
        correlationId: msg!.properties.correlationId,
      },
      content.match_options
    );
    let match = matchUser(userList, user);
    channel.ack(msg!);

    if (match) {
      let url = await editorService.postPair(
        match[0].match_options.user,
        match[1].match_options.user
      );

      let reply = {
        url,
      };
      match.forEach((m) => {
        channel.sendToQueue(
          m.reply_params.replyTo,
          Buffer.from(JSON.stringify(reply)),
          {
            correlationId: m.reply_params.correlationId,
          }
        );

        logger.debug(
          `Sending to correlationId: {${m.reply_params.correlationId}}, with message {${JSON.stringify(reply)}}`
        );
      });
    }
  });
});
