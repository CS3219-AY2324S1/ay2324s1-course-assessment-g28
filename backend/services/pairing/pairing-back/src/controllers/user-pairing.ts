import { List } from "../models/linked-list";
import Match from "../models/match";
import { Question } from "../models/question";
import { User } from "../models/user";
import {
  getRandomQuestion,
  getSpecificQuestion,
} from "../services/question/pp-question-service";
import config from "../utils/config";
import logger from "../utils/logger";

const SECOND = 1000;

function matchOnQuestion(user1: User, user2: User): Question | null {
  let question = null;

  // Cannot match user to themself
  if (user1.match_options.user == user2.match_options.user) {
    return null;
  } else if (user1.match_options.complexity && user2.match_options.complexity) {
    question = matchComplexity(user1, user2);
  } else if (user1.match_options.question || user2.match_options.question) {
    question = matchSpecificQuestion(user1, user2);
  }

  if (!question) {
    logger.info(
      `Question not found for parameters ${user1.match_options} and ${user2.match_options}`
    );
  }

  return question;
}

function matchComplexity(user1: User, user2: User): Question | null {
  if (user1.match_options.complexity !== user2.match_options.complexity) {
    return null;
  }

  return getRandomQuestion(user1.match_options.complexity);
}

function matchSpecificQuestion(user1: User, user2: User): Question | null {
  if (user1.match_options.question != user2.match_options.question) {
    return null;
  }

  return getSpecificQuestion(user1.match_options.question);
}

function matchUser(userList: List<User>, user: User): Match | null {
  let curr = userList.head;
  let now_timestamp = Date.now();

  while (curr) {
    let next = curr.next;

    if (
      curr.create_timestamp + config.MATCHMAKING_MAX_WAIT_SECONDS * SECOND <
      now_timestamp
    ) {
      curr.detach();
    } else {
      let question = matchOnQuestion(curr, user);
      if (question) {
        curr.detach();
        return new Match(curr, user, question);
      }
    }

    curr = next;
  }

  userList.append(user);
  return null;
}

function removeUser(userList: List<User>, correlationId: string): void {
  let curr = userList.head;

  while (curr) {
    if (curr.reply_params.correlationId == correlationId) {
      curr.detach();
      return;
    }
    curr = curr.next;
  }

  return;
}

export { matchUser, removeUser };
