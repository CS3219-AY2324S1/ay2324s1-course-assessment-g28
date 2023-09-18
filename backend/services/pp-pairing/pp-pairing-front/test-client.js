const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080/pairing?foo=bar&swag=true');

ws.on('error', console.error);

ws.on('open', function open() {
  ws.send('anything');
});

ws.on('message', function message(data) {
  console.log('received: %s', data);
});
