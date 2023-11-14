/* eslint-disable  @typescript-eslint/no-explicit-any */
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { LanguageSupport } from "@codemirror/language";

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

export const LANGUAGE_DATA: {
  [key: string]: { codeMirrorExtension: LanguageSupport; templateCode: string };
} = {
  Java: {
    codeMirrorExtension: java(),
    templateCode: "// Enter your code here",
  },
  JavaScript: {
    codeMirrorExtension: javascript({ jsx: true }),
    templateCode: "// Enter your code here",
  },
  Python: {
    codeMirrorExtension: python(),
    templateCode: "# Enter your code here",
  },
};

export const LANGUAGES = Object.keys(LANGUAGE_DATA);

export type LanguageType = (typeof LANGUAGES)[number];

export const CLASSNAME_MY_MESSAGE =
  "max-w-[90%] self-end bg-blue-400 text-white rounded-l-md rounded-br-md py-1 px-3";

export const CLASSNAME_PARTNER_MESSAGE =
  "max-w-[90%] self-start bg-gray-200 text-black rounded-r-md rounded-bl-md py-1 px-3";

export type WSMessageType = {
  data: string;
}

export type WSMessageDataType = {
  method: WS_METHODS;
  [key: string]: any;
}

export type PartnerDetailsType = {
  email: string;
  username: string;
  favouriteProgrammingLanguage: LanguageType;
}

export enum LoadingScreenText {
  FINISHED_LOADING =
    ``,
  INITIALIZING_EDITOR =
    `Please wait while we connect you to a coding session!`,
  CONNECTION_LOST =
    `You are disconnected from this session.
    Please check your network and reload the page.`,
  LOADING_NEXT_QUESTION =
    `Hold on tight! We're fetching the next question.`
}

export enum ErrorScreenText {
  NO_ERROR = 
    ``,
  CANNOT_CONNECT_TO_WS = 
    `Oops! The URL appears to be broken.`,
  INVALID_WSURL_PARAMS = 
    `Oops! This session does not exist.`,
  DUPLICATE_SESSION_ERROR = 
    `This session is already active on another tab!`,
  UNEXPECTED_ERROR = 
    `Oops, an unexpected error occurred!`
}
