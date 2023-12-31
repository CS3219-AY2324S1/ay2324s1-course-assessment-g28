/* eslint-disable  @typescript-eslint/no-explicit-any */
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import useWebSocket from "react-use-websocket";
import { Button, Select, SelectItem, Spinner } from "@nextui-org/react";
import { Panel, PanelGroup } from "react-resizable-panels";
import LoadingScreen from "../LoadingScreen";
import { dracula, tomorrow } from "thememirror";
import {
  ErrorScreenText,
  LANGUAGES,
  LANGUAGE_DATA,
  LoadingScreenText,
  PartnerDetailsType,
  WSMessageDataType,
  WSMessageType,
  WS_METHODS,
} from "../constants";
import {
  Update,
  receiveUpdates,
  sendableUpdates,
  collab,
  getSyncedVersion,
} from "@codemirror/collab";
import { basicSetup } from "codemirror";
import { ChangeSet, EditorState, Text, Compartment } from "@codemirror/state";
import { EditorView, ViewPlugin, ViewUpdate, keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { v4 as uuidv4 } from "uuid";
import { useTheme } from "next-themes";
import {
  SubmissionStatus,
  useSubmissionContext,
} from "../Submission/SubmissionContext";
import HorizontalResizeHandle from "@/components/PanelResizeHandles/HorizontalResizeHandle";
import { createQuestionAttempt, getPublicUserInfo } from "@/api/user";
import { Question, QuestionComplexity } from "@/api/questions/types";
import toast from "react-hot-toast";
import { CreateQuestionAttemptRequestBody } from "@/api/user/types";

interface CodeWindowProps {
  websocketUrl: string;
  question: Question;
  partnerDetails: PartnerDetailsType;
  setPartnerDetails: Dispatch<SetStateAction<PartnerDetailsType>>;
  setErrorScreenText: Dispatch<SetStateAction<ErrorScreenText>>;
  setLoadingScreenText: Dispatch<SetStateAction<LoadingScreenText>>;
}

// Used to hold the state of the editor's theme
// Will be reconfigured when user switches theme
const editorTheme = new Compartment();

export default function CodeWindow({
  websocketUrl,
  question,
  partnerDetails,
  setPartnerDetails,
  setErrorScreenText,
  setLoadingScreenText,
}: CodeWindowProps) {
  const { theme } = useTheme();
  const [language, setLanguage] = useState<string>("Python");
  const [result, setResult] = useState(
    'Click "Run Code" to execute your code!',
  );
  const [isWebsocketReady, setIsWebsocketReady] = useState(false);
  const [isCodeRunning, setIsCodeRunning] = useState(false);
  const [isCodeMirrorLoaded, setIsCodeMirrorLoaded] = useState(false);
  const [requestQueue, setRequestQueue] = useState<
    Record<string, (value: any) => void>
  >({});
  const {
    isPeerStillHere,
    setIsPeerStillHere,
    initateExitMyself,
    initateNextQnMyself,
    submissionStatus,
    setIsSubmitted,
  } = useSubmissionContext();

  const editorsParentRef = useRef<{ [lang: string]: HTMLDivElement | null }>(
    {},
  );
  const editorsRef = useRef<{ [lang: string]: EditorView }>({});

  const { sendJsonMessage } = useWebSocket(websocketUrl, {
    share: true,
    filter: () => false,
    onOpen: () => {
      console.log(
        "Websocket connection established (not yet ready for messages)",
      );
    },
    onMessage: onMessage,
    onError: onError,
    onClose: onClose,
  });

  useEffect(() => {
    // Change editor theme when user changes theme
    for (const lang in editorsRef.current) {
      const editorComponent = editorsRef.current[lang];

      editorComponent.dispatch({
        effects: editorTheme.reconfigure(theme === "dark" ? dracula : tomorrow),
      });
    }
  }, [theme]);

  useEffect(() => {
    if (
      submissionStatus === SubmissionStatus.SUBMIT_BEFORE_NEXT_QN ||
      submissionStatus === SubmissionStatus.SUBMIT_BEFORE_EXIT
    ) {
      setIsSubmitted(false);
      // Next question or exit approved by both users
      submitCode(null, true);
    }
  }, [submissionStatus]);

  function onMessage(e: WSMessageType) {
    const data = JSON.parse(e.data);
    console.log("CodeWindow received: ", data);

    switch (data.method) {
      case WS_METHODS.READY_TO_RECEIVE:
        handleReadyToReceive(data);
        break;
      case WS_METHODS.PEER_CONNECTED:
        handlePairConnected(data);
        break;
      case WS_METHODS.INVALID_WSURL_PARAMS:
        handleInvalidWsUrlParams(data);
        break;
      case WS_METHODS.OP:
        handleOp(data);
        break;
      case WS_METHODS.SWITCH_LANG:
        handleSwitchLang(data);
        break;
      case WS_METHODS.RUN_CODE:
        handleRunCode(data);
        break;
      case WS_METHODS.RUN_CODE_RESULT:
        handleRunCodeResult(data);
        break;
      case WS_METHODS.DUPLICATE_SESSION_ERROR:
        handleDuplicateSessionError(data);
        break;
      case WS_METHODS.UNEXPECTED_ERROR:
        handleUnexpectedError(data);
        break;
    }
  }

  function onClose(e: Event) {
    // Will show loading screen with text based on event
    // Disconnected -> Show check network and reload screen
    // Next question -> Show loading next question screen
    setIsPeerStillHere(false);
    if (submissionStatus === SubmissionStatus.SUBMIT_BEFORE_NEXT_QN) {
      setLoadingScreenText(LoadingScreenText.LOADING_NEXT_QUESTION);
    } else {
      setLoadingScreenText(LoadingScreenText.CONNECTION_LOST);
    }
  }

  function onError(e: Event) {
    console.log("!!! ERROR: Unable to connect to websocket !!!");
    setErrorScreenText(ErrorScreenText.CANNOT_CONNECT_TO_WS);
  }

  function handleReadyToReceive(data: WSMessageDataType) {
    console.log("+++ WebSocket is ready for messages +++");
    setIsWebsocketReady(true);
    setLoadingScreenText(LoadingScreenText.FINISHED_LOADING);

    setLanguage(data.language);
  }

  function handlePairConnected(data: WSMessageDataType) {
    const partnerId = data.partnerId;
    console.log("Your partner is:", partnerId);
    setIsPeerStillHere(true);
    setPartnerDetails((prevState) => {
      return {
        ...prevState,
        email: partnerId,
      };
    });
    getPublicUserInfo(partnerId).then((userInfo) => {
      setPartnerDetails((prevState) => {
        return {
          ...prevState,
          username: userInfo.username,
          favouriteProgrammingLanguage:
            userInfo.favouriteProgrammingLanguage ?? "unknown",
        };
      });
    });
  }

  function handleInvalidWsUrlParams(data: WSMessageDataType) {
    console.log("!!! ERROR !!! WsUrl params are invalid");
    setErrorScreenText(ErrorScreenText.INVALID_WSURL_PARAMS);
  }

  function handleOp(data: WSMessageDataType) {
    const requestId: string = data.requestId;

    if (requestId in requestQueue) {
      requestQueue[requestId](data.data);

      setRequestQueue((prevState) => {
        const newState = { ...prevState };
        delete newState[requestId];
        return newState;
      });
    }
  }

  function handleCaretPos(data: WSMessageDataType) {
    console.log("Partner's caret at ", data.start, " to ", data.end);
  }

  function handleSwitchLang(data: WSMessageDataType) {
    setLanguage(data.language);
  }

  function handleRunCode(data: WSMessageDataType) {
    setIsCodeRunning(true);
  }

  function handleRunCodeResult(data: WSMessageDataType) {
    console.log("*****RUN CODE RESULT*****");
    console.log(data);
    setResult(data.result);
    setIsCodeRunning(false);
  }

  function handleDuplicateSessionError(data: WSMessageDataType) {
    console.log("!!! Cannot open same session on another tab !!!");
    setErrorScreenText(ErrorScreenText.DUPLICATE_SESSION_ERROR);
  }

  function handleUnexpectedError(data: WSMessageDataType) {
    console.log("!!! An unexpected error occurred !!!", data);
    setErrorScreenText(ErrorScreenText.UNEXPECTED_ERROR);
  }

  //#region collaborative editing logic

  function pause(time: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, time));
  }

  function currentLatency() {
    const base = 100;
    return base * (1 + (Math.random() - 0.5));
  }

  class Connection {
    private disconnected: null | { wait: Promise<void>; resolve: () => void } =
      null;

    constructor(private getLatency: () => number = currentLatency) {}

    private _request(value: any): Promise<any> {
      return new Promise((resolve) => {
        //let channel = new MessageChannel
        //channel.port2.onmessage = event => resolve(JSON.parse(event.data))
        //this.worker.postMessage(JSON.stringify(value), [channel.port1])

        // Send request but need to find a way to receive the result
        // Send request here and return promise for caller to wait
        // The promise is stored in the state object requestQueue with a unique ID
        // Then during the WebSocket onMessage we resolve the promise
        const requestId = uuidv4();

        value.method = WS_METHODS.OP;
        value.requestId = requestId;
        sendJsonMessage(value);

        // Store the promise resolve to be called when result arrives via onMessage
        // Using callback function to setState ensures convergence to correct state
        setRequestQueue((prevState) => {
          return {
            ...prevState,
            [requestId]: resolve,
          };
        });
      });
    }

    async request(value: any) {
      const latency = this.getLatency();
      if (this.disconnected) await this.disconnected.wait;
      await pause(latency);
      const result = await this._request(value);
      if (this.disconnected) await this.disconnected.wait;
      await pause(latency);
      return result;
    }

    setConnected(value: boolean) {
      if (value && this.disconnected) {
        this.disconnected.resolve();
        this.disconnected = null;
      } else if (!value && !this.disconnected) {
        let resolve: any;
        const wait = new Promise<void>((r) => (resolve = r));
        this.disconnected = { wait, resolve };
      }
    }
  }

  function pushUpdates(
    connection: Connection,
    version: number,
    fullUpdates: readonly Update[],
    lang: string,
  ): Promise<boolean> {
    // Strip off transaction data
    const updates = fullUpdates.map((u) => ({
      clientID: u.clientID,
      changes: u.changes.toJSON(),
    }));
    return connection.request({
      type: "pushUpdates",
      version,
      updates,
      lang: lang,
    });
  }

  function pullUpdates(
    connection: Connection,
    version: number,
    lang: string,
  ): Promise<readonly Update[]> {
    return connection
      .request({ type: "pullUpdates", version, lang: lang })
      .then((updates) => {
        return updates.map((u: any) => ({
          changes: ChangeSet.fromJSON(u.changes),
          clientID: u.clientID,
        }));
      });
  }

  function getDocument(
    connection: Connection,
    lang: string,
  ): Promise<{ version: number; doc: Text }> {
    return connection
      .request({ type: "getDocument", lang: lang })
      .then((data) => ({
        version: data.version,
        doc: Text.of(data.doc.split("\n")),
      }));
  }

  function peerExtension(
    startVersion: number,
    connection: Connection,
    lang: string,
  ) {
    const plugin = ViewPlugin.fromClass(
      class {
        private pushing = false;
        private done = false;

        constructor(private view: EditorView) {
          this.pull();
        }

        update(update: ViewUpdate) {
          if (update.docChanged) this.push();
        }

        async push() {
          const updates = sendableUpdates(this.view.state);
          if (this.pushing || !updates.length) return;
          this.pushing = true;
          const version = getSyncedVersion(this.view.state);
          await pushUpdates(connection, version, updates, lang);
          this.pushing = false;
          // Regardless of whether the push failed or new updates came in
          // while it was running, try again if there's updates remaining
          if (sendableUpdates(this.view.state).length)
            setTimeout(() => this.push(), 100);
        }

        async pull() {
          while (!this.done) {
            const version = getSyncedVersion(this.view.state);
            const updates = await pullUpdates(connection, version, lang);
            this.view.dispatch(receiveUpdates(this.view.state, updates));
          }
        }

        destroy() {
          this.done = true;
        }
      },
    );
    return [collab({ startVersion }), plugin];
  }

  async function addPeer(lang: string) {
    const { version, doc } = await getDocument(new Connection(), lang);
    const connection = new Connection();
    const state = EditorState.create({
      doc,
      extensions: [
        basicSetup,
        LANGUAGE_DATA[lang].codeMirrorExtension,
        peerExtension(version, connection, lang),
        keymap.of([indentWithTab]),
        editorTheme.of(theme === "dark" ? dracula : tomorrow),
      ],
    });
    const editorParentDiv = editorsParentRef.current[lang];

    // Adds one editor per language
    // Display only the one for the selected language
    // Ensures version history is maintained separately for each language
    editorsRef.current[lang] = new EditorView({
      state,
      parent: editorParentDiv!,
    });
  }

  useEffect(() => {
    if (
      editorsParentRef.current !== null &&
      isWebsocketReady &&
      !isCodeMirrorLoaded
    ) {
      console.log("CodeMirror Ref initialized and WebSocket is loaded");

      for (const idx in LANGUAGES) {
        console.log(LANGUAGES[idx], parseInt(idx));
        addPeer(LANGUAGES[idx]);
      }

      setIsCodeMirrorLoaded(true);
    }
  }, [editorsParentRef, isWebsocketReady]);

  //#endregion

  //#region UI event handlers

  function onLanguageChange(val: string) {
    if (val === language) {
      return;
    }
    setLanguage(val);
    sendJsonMessage({
      method: WS_METHODS.SWITCH_LANG,
      language: val,
    });
  }

  /**
   * Sends the code through WebSocket to CollabService which will run the compiler / interpreter
   * WebSocket will inform both users of the result
   */
  function runCode(e: any) {
    const code = editorsRef.current[language].state.doc.toString();
    sendJsonMessage({
      method: WS_METHODS.RUN_CODE,
      language: language,
      code: code,
      // Testcases[]
    });
    setIsCodeRunning(true);
  }

  function submitCode(e: any, toSetIsSubmitted: boolean = false) {
    console.log("Submitting code...");
    const code = editorsRef.current[language].state.doc.toString();

    const questionAttempt: CreateQuestionAttemptRequestBody = {
      questionId: question.id ?? 0,
      questionTitle: question.title ?? "",
      questionDifficulty: question.complexity ?? QuestionComplexity.EASY,
      attemptDate: new Date().toISOString(),
      attemptDetails: code,
      attemptLanguage: language,
    };

    const otherUser = partnerDetails.email;

    if (otherUser !== "") {
      questionAttempt.otherUser = otherUser;
    }

    createQuestionAttempt(questionAttempt).then((res) => {
      console.log("After code submission:", res);
      toast.success("Your code has been submitted successfully!");

      if (toSetIsSubmitted) setIsSubmitted(true);
    });
  }

  //#endregion

  return (
    <PanelGroup direction="vertical" className="relative">
      {!isCodeMirrorLoaded && (
        <LoadingScreen displayText="Initializing Code Space ..."></LoadingScreen>
      )}
      <Panel defaultSize={80}>
        <div className="h-full w-full flex flex-col overflow-hidden rounded-xl bg-content1">
          <div className="w-full flex flex-row p-1">
            <div className="flex flex-row w-1/2 gap-2">
              <Select
                aria-label="select-language"
                placeholder={language}
                classNames={{
                  mainWrapper: "h-fit",
                  base: "h-fit",
                  trigger: "py-1 px-3 h-8 min-h-1",
                  value: "text-sm",
                }}
                defaultValue={language}
                key={language}
                value={language}
                disableSelectorIconRotation
                onChange={(e) => onLanguageChange(e.target.value)}
              >
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </Select>
              <Button
                disabled={isCodeRunning}
                onClick={runCode}
                size="sm"
                color="primary"
              >
                Run Code
              </Button>
              <Button
                disabled={isCodeRunning}
                onClick={submitCode}
                size="sm"
                color="secondary"
              >
                Submit
              </Button>
            </div>
            <div className="w-1/2 grow flex flex-row justify-end gap-2">
              {isPeerStillHere ? (
                <Button
                  disabled={isCodeRunning}
                  onClick={initateNextQnMyself}
                  size="sm"
                  color="warning"
                  className="text-white"
                >
                  Next Question
                </Button>
              ) : null}
              <Button onClick={initateExitMyself} size="sm" color="default">
                Exit
              </Button>
            </div>
          </div>
          <div id="editors" className="grow w-full overflow-y-scroll text-lg">
            {LANGUAGES.map((lang, i) => (
              <div
                className={`bg-content2 h-full w-full ${
                  language === lang ? "visible" : "hidden max-h-0"
                }`}
                key={lang}
                ref={(el) => (editorsParentRef.current[lang] = el)}
              />
            ))}
          </div>
        </div>
      </Panel>
      <HorizontalResizeHandle />
      <Panel>
        <div className="h-full w-full flex flex-col overflow-auto rounded-xl relative box-border bg-content1">
          {isCodeRunning && isWebsocketReady ? (
            <div className="w-full h-full grid content-center bg-content1 rounded-md">
              <Spinner label="Executing code..." color="secondary"></Spinner>
            </div>
          ) : (
            <div className="h-full w-full max-w-full p-3 whitespace-pre-wrap break-words bg-content1">
              {result}
            </div>
          )}
        </div>
      </Panel>
    </PanelGroup>
  );
}
