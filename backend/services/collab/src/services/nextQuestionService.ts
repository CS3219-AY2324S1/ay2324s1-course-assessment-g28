import { QUESTION_API_RANDOM_URL } from "../constants";
// @ts-ignore
import * as fetch from "node-fetch";

export async function getNextQuestion(userId: string, partnerId: string, complexity: number) {
  const urlWithParams = new URL(QUESTION_API_RANDOM_URL);
  urlWithParams.searchParams.set("user1", userId);
  urlWithParams.searchParams.set("user2", partnerId);
  urlWithParams.searchParams.set("complexity", complexity.toString());

  console.log("Fetching random qn from:", urlWithParams);

  const response = await fetch(urlWithParams);
  const responseJson = await response.json();
  const questionId: number = responseJson["questionId"];

  return questionId;
}