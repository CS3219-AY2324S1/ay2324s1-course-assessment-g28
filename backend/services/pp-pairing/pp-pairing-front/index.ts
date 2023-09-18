import { IncomingMessage } from "http";
import url from "url";
import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080, path: "/path" });

wss.on("connection", function connection(ws: WebSocket, req: IncomingMessage) {
  console.log(url.parse(req.url!, true).query);

  ws.on("error", console.error);

  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });

  ws.send("something");
});
