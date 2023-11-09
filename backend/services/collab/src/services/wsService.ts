import { WS_METHODS } from "../constants";
import { sendMessage } from "../utils/websocketUtil";
import { runCode } from "./executionService";
import { getNextQuestion } from "./nextQuestionService";
import { handleOperationOt } from "./otService";
import { getComplexityByPairId, updatePairNextQuestion } from "./pairService";

export function getQueryParams(url: string): { [key: string]: string } {
  const queryIdx = url.indexOf("?");
  const paramString = url.substring(queryIdx + 1).split("&");
  console.log("paramString", paramString);
  const params: { [key: string]: string } = {};

  paramString.forEach((param) => {
    console.log("Param ", param);
    const keyValuePair = param.split("=");
    console.log("Keyvaluepair ", keyValuePair);
    params[keyValuePair[0]] = keyValuePair[1];
  });

  return params;
}

export function handleReadyToReceive(connection: WebSocket) {
  const message = JSON.stringify({ method: WS_METHODS.READY_TO_RECEIVE });
  sendMessage(connection, message);
}

export function handlePairConnected(
  connection: WebSocket, 
  partnerConnection: WebSocket, 
  userId: string,
  partnerId: string
) {
  const messageUser = JSON.stringify({ 
    method: WS_METHODS.PAIR_CONNECTED, 
    partnerId: partnerId 
  });
  const messagePartner = JSON.stringify({ 
    method: WS_METHODS.PAIR_CONNECTED, 
    partnerId: userId 
  });
  
  sendMessage(connection, messageUser);
  sendMessage(partnerConnection, messagePartner);
}

export function handleOp(
  connection: WebSocket,
  partnerConnection: WebSocket,
  pairId: string,
  data: any
) {
  const requestId = data.requestId;
  const lang = data.lang;
  handleOperationOt(connection, pairId, requestId, lang, data);
}

export function handleCaretPos(
  connection: WebSocket,
  partnerConnection: WebSocket,
  data: any
) {
  const message = JSON.stringify({
    method: WS_METHODS.CARET_POS,
    start: data.start,
    end: data.end,
  });
  sendMessage(partnerConnection, message);
}

export function handleSwitchLang(
  connection: WebSocket,
  partnerConnection: WebSocket,
  data: any
) {
  const message = JSON.stringify({
    method: WS_METHODS.SWITCH_LANG,
    language: data.language,
  });
  sendMessage(partnerConnection, message);
}

export function handleRunCode(
  connection: WebSocket,
  partnerConnection: WebSocket,
  data: any
) {
  const message = JSON.stringify({ method: WS_METHODS.RUN_CODE });
  sendMessage(partnerConnection, message);

  // TODO: Compile/run code and broadcast result with RUN_CODE_RESULT

  runCode(data.code, data.language).then((result) => {
    console.log("Finished running code. Result: ", result);
    const messageResult = JSON.stringify({
      method: WS_METHODS.RUN_CODE_RESULT,
      result: result,
    });
    sendMessage(connection, messageResult);
    sendMessage(partnerConnection, messageResult)
  });
}

export function handleMessage(
  connection: WebSocket,
  partnerConnection: WebSocket,
  data: any
) {
  const message = JSON.stringify({
    method: WS_METHODS.MESSAGE,
    message: data.message,
  });
  sendMessage(partnerConnection, message);
}

export function handleExit(
  connection: WebSocket,
  partnerConnection: WebSocket,
  data: any
) {
  const message = JSON.stringify({ method: WS_METHODS.EXIT });
  connection.close();
  sendMessage(partnerConnection, message);
}

export async function handleNextQuestionId(
  connection: WebSocket,
  partnerConnection: WebSocket,
  userId: string,
  partnerId: string,
  pairId: string,
) {
  const complexity = await getComplexityByPairId(pairId);
  const questionId = await getNextQuestion(userId, partnerId, complexity);
  await updatePairNextQuestion(pairId, questionId);

  const message = JSON.stringify({ method: WS_METHODS.NEXT_QUESTION_ID, questionId })

  sendMessage(connection, message);
  sendMessage(partnerConnection, message);
}

export function handlePartnerDisconnected(
  connection: WebSocket,
  partnerConnection: WebSocket,
) {
  const message = JSON.stringify({ method: WS_METHODS.PARTNER_DISCONNECTED });
  sendMessage(partnerConnection, message);
}

export function handleDefault(
  partnerConnection: WebSocket,
  method: WS_METHODS
) {
  const message = JSON.stringify({ method: method });
  sendMessage(partnerConnection, message);
}
