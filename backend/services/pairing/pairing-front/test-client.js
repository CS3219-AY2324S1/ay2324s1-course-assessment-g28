const WebSocket = require("ws");

const ws = new WebSocket("ws://localhost:4000/pairing?user=bar&swag=true");

ws.on("error", console.error);

ws.on("open", function open() {
  ws.send("anything");
});

ws.on("message", function message(data) {
  console.log(JSON.parse(data.toString()));
  // console.log('received: %s', JSON.parse(data));
});

// setTimeout(() => {
//   ws.close();
//   ws.close();
// }, 1000);
