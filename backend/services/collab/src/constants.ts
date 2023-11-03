export enum WS_METHODS {
  READY, //
  OP, // To indicate I've handled this
  CARET_POS,
  GET_TURN,
  GET_TURN_RESULT,
  SWITCH_LANG, //
  RUN_CODE, //
  RUN_CODE_RESULT,
  NEXT_QUESTION,
  NEXT_QUESTION_CONFIRM,
  EXIT,
  MESSAGE,
  TESTCASE_ADD,
  TESTCASE_DELETE,
  TESTCASE_EDIT,
};

export const LANGUAGE_IDS: { [language: string]: number } = {
  Java: 62,
  JavaScript: 63,
  Python: 71
}

type ProgrammingLanguages = "java" | "python" | "javascript"

// initial documents for each language
export const initialDocuments:Record<ProgrammingLanguages, string> = {
  "java": 
`class Main {
  public static void main(String[] args) {
    // Write your code here
  }
}`,
  "python": "# Write your code here",
  "javascript": "// Write your code here"
}