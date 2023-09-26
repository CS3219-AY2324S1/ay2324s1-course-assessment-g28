import { javascript } from '@codemirror/lang-javascript';
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";

export enum WS_METHODS {
  OP,
  GET_TURN,
  GET_TURN_RESULT,
  SWITCH_LANG,
  RUN_CODE,
  RUN_RESULT,
  NEXT_QUESTION,
  EXIT,
  MESSAGE,
  ADD_TESTCASE,
  DELETE_TESTCASE,
  EDIT_TESTCASE
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