export enum WS_METHODS {
  READY_TO_RECEIVE, //
  PAIR_CONNECTED,
  OP, // To indicate I've handled this
  CARET_POS,
  GET_TURN,
  GET_TURN_RESULT,
  SWITCH_LANG, //
  RUN_CODE, //
  RUN_CODE_RESULT,

  NEXT_QUESTION_INITATED_BY_PEER,
  NEXT_QUESTION_CONFIRM,
  NEXT_QUESTION_ID,
  NEXT_QUESTION_REJECT,

  EXIT_INITIATED_BY_PEER,
  EXIT_CONFIRM,
  EXIT_REJECT,
  PEER_HAS_EXITED,
  EXIT,
  PARTNER_DISCONNECTED,

  MESSAGE,
  INVALID_WSURL_PARAMS,
  UNEXPECTED_ERROR
}

export const LANGUAGE_IDS: { [language: string]: number } = {
  Java: 62,
  JavaScript: 63,
  Python: 71
}

export type ProgrammingLanguages = "Java" | "Python" | "JavaScript";

// initial documents for each language
export const initialDocuments: Record<ProgrammingLanguages, string> = {
  Java:
    `class Main {
  public static void main(String[] args) {
    // Write your code here
  }
}`,
  Python: "# Write your code here",
  JavaScript: "// Write your code here"
}

export type PairState = {
  messages: { from: string, message: string }[],
  language: ProgrammingLanguages
}

export const QUESTION_API_RANDOM_URL = 
  process.env.QUESTION_API + "/question/unattemptedUsersMatch";

export const DEFAULT_EXPIRY = 24 * 3600;
export const DEFAULT_EXPIRY_AFTER_EXIT = 3600;