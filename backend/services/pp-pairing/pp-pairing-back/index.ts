import amqp from "amqplib/callback_api";
import dotenv from "dotenv";
import { User } from "./src/models/user";
import { List } from "./src/models/linked-list";
import matchUser from "./src/controllers/user-pairing";
import MockEditor from "./src/services/editor/mock-editor";
import logger from "./src/utils/logger";
import config from "./src/utils/config";

amqp.connect(config.RABBITMQ_URL, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  logger.info(`Connected to ${config.RABBITMQ_URL}`);

  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    let editorService = new MockEditor();
    let userList = new List<User>();

    var queue = "pairing_requests";
    channel.assertQueue(queue, {
      durable: false,
    });
    logger.info(`Awaiting pairing requests on queue: {${queue}}`);

    channel.consume(queue, async function (msg) {
      logger.debug(
        `Received pairing request on queue: {${queue}}, with content {${msg?.content.toString()}, with correlationId {${
          msg?.properties.correlationId
        }}}`
      );

      let user = new User(
        {
          replyTo: msg!.properties.replyTo,
          correlationId: msg!.properties.correlationId,
        },
        JSON.parse(msg!.content.toString())
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

          console.log(`queue: ${m.reply_params.replyTo}`);

          logger.debug(
            `Sending to correlationId: {${m.reply_params.correlationId}}, with message {${reply}}`
          );
        });
      }
    });
  });
});
