export function sendMessage(connection: WebSocket, message: string) {
  if (connection === null || connection === undefined || connection.readyState !== connection.OPEN) {
    console.log("!!! Could not send message for connection: ", connection);
    console.log("Message: ", message);
    return;
  }

  connection.send(message);
}