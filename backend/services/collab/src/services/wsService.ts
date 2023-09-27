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

export function handleReady(connection: WebSocket, partnerConnection: WebSocket, userId: string, partnerId: string, currTurnId: string) {
  const message = JSON.stringify({ method: WS_METHODS.READY, isMyTurn: false });
  const messageIsTurn = JSON.stringify({ method: WS_METHODS.READY, isMyTurn: true });
  
  if (userId === currTurnId) {
    connection.send(messageIsTurn);
    partnerConnection.send(message);
  } else {
    connection.send(message);
    partnerConnection.send(messageIsTurn);
  }
}

export function handleOp(connection: WebSocket, partnerConnection: WebSocket, data) {
  const message = JSON.stringify({ method: WS_METHODS.OP, op: data.op });
  partnerConnection.send(message);
}

export function handleCaretPos(connection: WebSocket, partnerConnection: WebSocket, data) {
  const message = JSON.stringify({ method: WS_METHODS.OP, start: data.start, end: data.end });
  partnerConnection.send(message);
}

export function handleSwitchLang(connection: WebSocket, partnerConnection: WebSocket, data) {
  const message = JSON.stringify({ method: WS_METHODS.SWITCH_LANG, language: data.language });
  partnerConnection.send(message);
}

export function handleRunCode(connection: WebSocket, partnerConnection: WebSocket, data) {
  const message = JSON.stringify({ method: WS_METHODS.RUN_CODE });
  partnerConnection.send(message);

  // TODO: Compile/run code and broadcast result with RUN_CODE_RESULT
}
