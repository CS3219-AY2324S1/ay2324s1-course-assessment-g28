import React, { useCallback, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { Button, Select, SelectItem } from '@nextui-org/react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import ResizeHandleHorizontal from '../ResizeHandleHorizontal';
import LoadingScreen from '../LoadingScreen';
import { LANGUAGES, LANGUAGE_DATA, LANGUAGE_TYPE, WS_METHODS } from '../constants';

interface CodeWindowProps {
  template?: string,
  language?: string,
  websocketUrl: string,
  question: any
}

export default function CodeWindow(props: CodeWindowProps) {
  const [language, setLanguage] = useState<string>(props.language ?? "Java");
  const [code, setCode] = useState(LANGUAGE_DATA[language].templateCode);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [isWebsocketLoaded, setIsWebsocketLoaded] = useState(false);
  const [isCodeRunning, setIsCodeRunning] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {

  }, props.question);

  const { sendJsonMessage, readyState } = useWebSocket(props.websocketUrl, {
    share: true,
    filter: () => false,
    onOpen: () => {
      console.log("Websocket connection established");
      setIsWebsocketLoaded(true);
    },
    onMessage: onMessage,
    onClose: onClose,
    onError: onError
  });

  function onMessage(e: Event) {
    const data = JSON.parse(e.data);
    console.log(data);

    switch (data.method) {
      case WS_METHODS.READY:
        handleReady(data);
        break;
      case WS_METHODS.OP:
        handleOp(data);
        break;
      case WS_METHODS.CARET_POS:

      case WS_METHODS.SWITCH_LANG:
        handleSwitchLang(data);
        break;
      case WS_METHODS.RUN_CODE:
        handleRunCode(data);
        break;
    }
  }

  function onClose(e: Event) {
    console.log("Closing ws", e);
    // TODO
  }

  function onError(e: Event) {
    // TODO: Handle error
  }

  function handleReady(data) {
    setIsMyTurn(data.isMyTurn);
    setIsInitialized(true);
  }

  function handleOp(data) {
    // TODO: Real time collab
    setCode(data.op);
  }

  function handleCaretPos(data) {
    console.log("Partner's caret at ", data.start, " to ", data.end);
  }

  function handleSwitchLang(data) {
    setLanguage(data.language);
    setCode(LANGUAGE_DATA[data.language].templateCode);
  }

  function handleRunCode(data) {
    setIsCodeRunning(true);
  }

  /**
   * Called at the start of each question
   */
  function initEditor() {
    console.log("Initializing editor");
    getIsMyTurn();
  }

  function getIsMyTurn() {
    console.log("Checking if its your turn...");
    sendJsonMessage({
      method: WS_METHODS.GET_TURN,
    });
  }

  function onCodeChange(val: string) {
    setCode(val);

    console.log(val);

    // TODO: Handle ops
    sendJsonMessage({
      method: WS_METHODS.OP,
      op: val
    });
  }

  function onMouseUp(e) {
    console.log(e.srcElement?.selectionStart, e.srcElement?.selectionEnd);
    console.log(e.target?.selectionStart, e.target?.selectionEnd);
    console.log(e.currentTarget?.selectionStart, e.currentTarget?.selectionEnd);

    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;

    console.log(e.srcElement, e.target, e.currentTarget);

    sendJsonMessage({
      method: WS_METHODS.CARET_POS,
      start: start,
      end: end
    });
  }

  function onLanguageChange(val: string) {
    setLanguage(val);
    setCode(LANGUAGE_DATA[val].templateCode);
    sendJsonMessage({
      method: WS_METHODS.SWITCH_LANG,
      language: val
    });
  }

  /**
   * Sends the code through WebSocket to CollabService which will run the compiler / interpreter
   * WebSocket will inform both users of the result
   */
  function runCode(e) {
    sendJsonMessage({
      method: WS_METHODS.RUN_CODE,
      language: language,
      code: code,
      // Testcases[]
    });
    setIsCodeRunning(true);
  }

  function nextQuestion() {
    
  }

  // Called by the partner
  function confirmNextQuestion() {

  }

  function exitEditor() {

  }

  return (
    <PanelGroup direction="vertical" className="relative">
      {(() => {
        if (!isInitialized) {
          return (
            <LoadingScreen displayText="Initializing Code Space ..."></LoadingScreen>
          );
        }
      })()}
      <Panel defaultSize={60}>
        <div className="h-full w-full flex flex-col bg-white overflow-auto rounded-xl">
          <div className="w-full flex flex-row p-1">
            <div className="flex flex-row w-1/2 gap-2">
              <Select
                placeholder={language}
                classNames={{
                  mainWrapper: "h-fit",
                  base: "h-fit",
                  trigger: "py-1 px-3 h-8 min-h-1",
                  value: "text-sm"
                }}
                defaultValue={language}
                key={language}
                value={language}
                disableSelectorIconRotation
                onChange={e => onLanguageChange(e.target.value)}
              >
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </Select>
              <Button disabled={isCodeRunning} onClick={runCode} size="sm" color="success" className='text-white h-8 font-bold px-5'>
                Run Code
              </Button>
            </div>
            <div className="w-1/2 grow flex flex-row justify-end gap-2">
              <Button disabled={isCodeRunning} onClick={nextQuestion} size="sm" color="warning" className='text-white h-8 font-bold'>
                Next Question
              </Button>
              <Button onClick={exitEditor} size="sm" color="default" className='h-8 font-bold'>
                Exit
              </Button>
            </div>
          </div>
          <CodeMirror
            
            className="h-full w-full"
            value={code} 
            height="100%" 
            extensions={[LANGUAGE_DATA[language].codeMirrorExtension]} 
            onChange={onCodeChange}
            lang={language}
            onMouseUp={onMouseUp}
          />
        </div>
      </Panel>
      <PanelResizeHandle children={ResizeHandleHorizontal()}></PanelResizeHandle>
      <Panel>
        <div className="h-full w-full flex flex-col bg-white overflow-auto rounded-xl relative box-border">
          {(() => {
            if (isCodeRunning && isInitialized) {
              return (
                <LoadingScreen displayText="Waiting for result ..."></LoadingScreen>
              );
            }
          })()}
        </div>
      </Panel>
    </PanelGroup>
  );
}
