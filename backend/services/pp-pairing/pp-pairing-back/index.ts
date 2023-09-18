import amqp from "amqplib/callback_api";
import dotenv from "dotenv";

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

    var queue = "pairing_requests";
    channel.assertQueue(queue, {
      durable: false,
    });
    console.log(`Awaiting pairing requests on queue: {${queue}}`);

    channel.consume(queue, function (msg) {
      var reply = {
        data: "Bonjour",
      };
      channel.sendToQueue(
        msg!.properties.replyTo,
        Buffer.from(JSON.stringify(reply)),
        {
          correlationId: msg!.properties.correlationId,
        }
      );

      channel.ack(msg!);
    });
  });
});
