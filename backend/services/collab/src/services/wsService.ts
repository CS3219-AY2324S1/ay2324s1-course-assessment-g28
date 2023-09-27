import { WS_METHODS } from "../constants";

export function getQueryParams(url: string): { [key: string]: string } {
  const queryIdx = url.indexOf("?");
  const paramString = url.substring(queryIdx + 1).split("&");
  console.log("paramString", paramString);
  const params: { [key: string]: string } = {};

  paramString.forEach(param => {
    console.log("Param ", param);
    const keyValuePair = param.split("=");
    console.log("Keyvaluepair ", keyValuePair)
    params[keyValuePair[0]] = keyValuePair[1];
  })

  return params;
}

export function handleOperation(connection: WebSocket, partnerConnection: WebSocket, data) {
  partnerConnection.send(data.op);
}

export function handleReady(connection: WebSocket, partnerConnection: WebSocket) {
  const message = JSON.stringify({ method: WS_METHODS.READY });
  connection.send(message);
  partnerConnection.send(message);
}
