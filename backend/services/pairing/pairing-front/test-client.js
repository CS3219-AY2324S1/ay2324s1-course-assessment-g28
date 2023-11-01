const WebSocket = require("ws");
const uuid = require("uuid").v4;

const id = uuid();
const ws = new WebSocket(`ws://localhost:4000/pairing?user=${id}&complexity=0`);

ws.on("error", console.error);

ws.on("open", function open() {
  ws.send("anything");
});

ws.on("message", function message(data) {
  console.log(JSON.parse(data.toString()));
  // console.log('received: %s', JSON.parse(data));
});

console.log(`My ID = ${id}`);
