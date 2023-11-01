import amqp from "amqplib";
import { List } from "../models/linked-list";
import { User } from "../models/user";
import logger from "../utils/logger";
import { matchUser } from "../controllers/user-pairing";
import { getRandomQuestion } from "../services/question/pp-question-service";

export interface EditorWebSocketUrls {
  user1: string;
  user2: string;
}

const editorServiceApiPath = "/pairing/getWebSocketUrl";

async function postPair(_user1: string, _user2: string): Promise<EditorWebSocketUrls> {
  const queryParams = new URLSearchParams({
    user1: _user1,
    user2: _user2,
  });

  const reqUrl =
    process.env.EDITOR_SERVICE_URL +
    editorServiceApiPath +
    "?" +
    queryParams.toString();
  const res = await fetch(reqUrl, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const body = await res.json();
  return body;
}

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
    console.log(match);
    channel.ack(msg!);

    if (match) {
      const {user1, user2} = await postPair(
        match.user1.match_options.user,
        match.user2.match_options.user
      );
      // Reply to user 1
      const reply1 = {
        url: user1,
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
      const reply2 = {
        url: user2,
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
