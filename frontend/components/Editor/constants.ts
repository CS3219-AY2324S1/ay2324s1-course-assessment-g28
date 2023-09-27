import { javascript } from '@codemirror/lang-javascript';
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";

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

export const LANGUAGE_DATA: {[key: string]: {codeMirrorExtension: any, templateCode: string}} = {
  Java: {
    codeMirrorExtension: java(),
    templateCode: "// Enter your code here"
  },
  JavaScript: {
    codeMirrorExtension: javascript({ jsx: true }),
    templateCode: "// Enter your code here"
  },
  Python: {
    codeMirrorExtension: python(),
    templateCode: "# Enter your code here"
  }
}

export const LANGUAGES = Object.keys(LANGUAGE_DATA);

export type LANGUAGE_TYPE = typeof LANGUAGES[number];