import { WS_METHODS } from "../constants";
import { runCode } from "./executionService";
import { handleOperation } from "./otService";

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
  const isMyTurn = userId == currTurnId;
  const messageUser = JSON.stringify({ method: WS_METHODS.READY, isMyTurn: isMyTurn });
  const messagePartner = JSON.stringify({ method: WS_METHODS.READY, isMyTurn: !isMyTurn });
  
  connection.send(messageUser);
  partnerConnection.send(messagePartner);
}

export function handleOp(connection: WebSocket, partnerConnection: WebSocket, pairId: string, data: any) {
  const requestId = data.requestId;
  const lang = data.lang;
  handleOperation(connection, pairId, requestId, lang, data);
}

export function handleCaretPos(connection: WebSocket, partnerConnection: WebSocket, data: any) {
  const message = JSON.stringify({ method: WS_METHODS.CARET_POS, start: data.start, end: data.end });
  partnerConnection.send(message);
}

export function handleSwitchLang(connection: WebSocket, partnerConnection: WebSocket, data: any) {
  const message = JSON.stringify({ method: WS_METHODS.SWITCH_LANG, language: data.language });
  partnerConnection.send(message);
}

export function handleRunCode(connection: WebSocket, partnerConnection: WebSocket, data: any) {
  const message = JSON.stringify({ method: WS_METHODS.RUN_CODE });
  partnerConnection.send(message);

  // TODO: Compile/run code and broadcast result with RUN_CODE_RESULT

  runCode(data.code, data.language).then(result => {
    console.log("Finished running. Result: ", result);
    const messageResult = JSON.stringify({ method: WS_METHODS.RUN_CODE_RESULT, result: result });
    connection.send(messageResult);
    partnerConnection.send(messageResult);
  });
}

export function handleMessage(connection: WebSocket, partnerConnection: WebSocket, data: any) {
  const message = JSON.stringify({ method: WS_METHODS.MESSAGE, message: data.message });
  partnerConnection.send(message);
}

export function handleExit(connection: WebSocket, partnerConnection: WebSocket, data: any) {
  const message = JSON.stringify({ method: WS_METHODS.EXIT });
  connection.close();
  partnerConnection.send(message);
}