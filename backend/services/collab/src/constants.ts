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
  Java: 91,
  JavaScript: 93,
  Python: 92
}