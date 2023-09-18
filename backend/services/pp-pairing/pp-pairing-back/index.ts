import amqp from "amqplib/callback_api";
import dotenv from "dotenv";
import { User } from "./src/models/user-list";
import { List } from "linked-list";
import matchUser from "./src/controllers/user-pairing";
import MockEditor from "./src/services/editor/mock-editor";

dotenv.config();
const RABBITMQ_URL = process.env.RABBITMQ_URL!;

console.log(`Connected to ${RABBITMQ_URL}`);

amqp.connect(RABBITMQ_URL, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  console.log(`Connected to ${RABBITMQ_URL}`);

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
    console.log(`Awaiting pairing requests on queue: {${queue}}`);

    channel.consume(queue, async function (msg) {
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
        });
      }

      // var reply = {
      //   data: "Bonjour",
      // };
      // channel.sendToQueue(
      //   msg!.properties.replyTo,
      //   Buffer.from(JSON.stringify(reply)),
      //   {
      //     correlationId: msg!.properties.correlationId,
      //   }
      // );
    });
  });
});
