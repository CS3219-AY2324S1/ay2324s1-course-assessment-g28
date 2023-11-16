import { Complexity, Question } from "../../models/question";
import config from "../../utils/config";
import logger from "../../utils/logger";

let cache: Question[] = [];

keepUpdating();

function keepUpdating() {
  updateCache()
    .catch((error) => {
      logger.error(`Error while updating cache: ${error}`);
    })
    .finally(() => {
      setTimeout(() => {
        keepUpdating();
      }, 10000);
    });
}

async function updateCache() {
  let res = await fetch(`${config.QUESTION_URL}/questions`, {
    method: "GET",
  });
  if (!res.ok) {
    console.log("Error while fetching questions:", res.statusText);
    throw new Error(`Response not ok: ${res.statusText}`);
  }
  let content: any[] = (await res.json()).content;
  let questions = content!.map((q) => {
    return Question.fromJson(q);
  });
  cache = questions;
}

export function getRandomQuestion(complexity?: Complexity): Question | null {
  let questions = complexity != null
    ? cache.filter((q) => q.complexity === complexity)
    : cache;

  const index = Math.floor(Math.random() * questions.length);
  return questions[index];
}

export function getSpecificQuestion(questionId: number): Question | null {
  const question = cache.find((q) => q.id === questionId);
  return question ? question : null;
}
