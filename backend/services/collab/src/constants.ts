export enum WS_METHODS {
  READY_TO_RECEIVE,
  OP,
  SWITCH_LANG,
  RUN_CODE,
  RUN_CODE_RESULT,
  MESSAGE,

  PEER_CONNECTED,
  PEER_DISCONNECTED,

  NEXT_QUESTION_INITATED_BY_PEER,
  NEXT_QUESTION_CONFIRM,
  NEXT_QUESTION_ID,
  NEXT_QUESTION_REJECT,

  EXIT_INITIATED_BY_PEER,
  EXIT_CONFIRM,
  EXIT_REJECT,
  PEER_HAS_EXITED,

  INVALID_WSURL_PARAMS,
  DUPLICATE_SESSION_ERROR,
  UNEXPECTED_ERROR,
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

export type ConnectionDetails = {
  connection: WebSocket,
  partnerId: string,
}

export type PairConnectionDetails = {
  [user: string]: ConnectionDetails,
}

export type PairState = {
  messages: { from: string, message: string }[],
  language: ProgrammingLanguages,
  connectionDetails: PairConnectionDetails,
}

export const QUESTION_API_RANDOM_URL = 
  process.env.QUESTION_API + "/question/unattemptedUsersMatch";

// In seconds
export const DEFAULT_EXPIRY_SECONDS = 24 * 3600;

// Used for timeout (in ms)
export const DEFAULT_EXPIRY_AFTER_EXIT_MS = 3600 * 1000;