const amqp = require("amqplib/callback_api");
const dotenv = require("dotenv");

dotenv.config();
const QUESTION_URL = "http://localhost:1234";

// amqp.connect(RABBITMQ_URL, function (error0, connection) {
//   if (error0) {
//     throw error0;
//   }
//   connection.createChannel(function (error1, channel) {
//     if (error1) {
//       throw error1;
//     }
//     var queue = "hello";
//     var msg = "Hello world";

//     channel.assertQueue(queue, {
//       durable: false,
//     });

//     channel.sendToQueue(queue, Buffer.from(msg));
//     console.log(" [x] Sent %s", msg);
//   });
// });

fetch(`${QUESTION_URL}/questions?complexity=0`, {
  method: "GET",
}).then((response) => {
  // console.log(response);
  return response.json()
}).then((data) => {
  console.log(data)
});


