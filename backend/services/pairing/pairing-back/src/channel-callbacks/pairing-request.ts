import amqp from "amqplib";
import MockEditor from "../services/editor/mock-editor";
import { List } from "../models/linked-list";
import { User } from "../models/user";
import logger from "../utils/logger";
import { matchUser } from "../controllers/user-pairing";

let editorService = new MockEditor();
let userList = new List<User>();

export default function getPairingRequestCallback(
  channel: amqp.Channel,
  request_queue: amqp.Replies.AssertQueue
) {
  return async (msg: amqp.ConsumeMessage | null) => {
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
          `Sending to correlationId: {${
            m.reply_params.correlationId
          }}, with message {${JSON.stringify(reply)}}`
        );
      });
    }
  };
}
