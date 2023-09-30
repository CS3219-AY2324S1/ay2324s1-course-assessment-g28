import amqp from "amqplib";
import MockEditor from "../services/editor/mock-editor";
import { List } from "../models/linked-list";
import { User } from "../models/user";
import logger from "../utils/logger";
import { matchUser } from "../controllers/user-pairing";
import { getRandomQuestion } from "../services/question/pp-question-service";

let editorService = new MockEditor();

export default function getPairingRequestCallback(
  channel: amqp.Channel,
  request_queue: amqp.Replies.AssertQueue,
  userList: List<User>
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
    let match = await matchUser(userList, user);
    channel.ack(msg!);

    if (match) {
      let url = await editorService.postPair(
        match.user1.match_options.user,
        match.user2.match_options.user
      );

      // Reply to user 1
      let reply1 = {
        url,
        otherUser: match.user2.match_options.user,
        questionId: match.question.id,
      };
      channel.sendToQueue(
        match.user1.reply_params.replyTo,
        Buffer.from(JSON.stringify(reply1)),
        {
          correlationId: match.user1.reply_params.correlationId,
        }
      );

      // Reply to user 2
      let reply2 = {
        url,
        otherUser: match.user1.match_options.user,
        questionId: match.question.id,
      };
      channel.sendToQueue(
        match.user2.reply_params.replyTo,
        Buffer.from(JSON.stringify(reply2)),
        {
          correlationId: match.user2.reply_params.correlationId,
        }
      );
    }
  };
}
