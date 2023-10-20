import React, { useCallback, useEffect, useRef, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import CodeMirror from '@uiw/react-codemirror';
import { EditorSelection } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { Button, Select, SelectItem } from '@nextui-org/react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import ResizeHandleHorizontal from '../ResizeHandleHorizontal';
import LoadingScreen from '../LoadingScreen';
import { LANGUAGES, LANGUAGE_DATA, LANGUAGE_TYPE, WS_METHODS } from '../constants';
import {Update, receiveUpdates, sendableUpdates, collab, getSyncedVersion} from "@codemirror/collab"
import {basicSetup} from "codemirror"
import {ChangeSet, EditorState, Text} from "@codemirror/state"
import {EditorView, ViewPlugin, ViewUpdate} from "@codemirror/view"
import {workerScript} from "./worker.ts";
import { v4 as uuidv4 } from "uuid";

interface CodeWindowProps {
  template?: string,
  language?: string,
  websocketUrl: string,
  question: any
}

export default function CodeWindow(props: CodeWindowProps) {
  const [language, setLanguage] = useState<string>(props.language ?? "Java");
  const [code, setCode] = useState(LANGUAGE_DATA[language].templateCode);
  const [result, setResult] = useState("Click \"Run Code\" to execute your code!");
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [isWebsocketLoaded, setIsWebsocketLoaded] = useState(false);
  const [isCodeRunning, setIsCodeRunning] = useState(false);
  const [isCodeMirrorLoaded, setIsCodeMirrorLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [requestQueue, setRequestQueue] = useState({});

  const editorsRef = useRef([]);

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
    //console.log("CodeWindow received: ", data);

    switch (data.method) {
      case WS_METHODS.READY:
        handleReady(data);
        break;
      case WS_METHODS.OP:
        handleOp(data);
        break;
      case WS_METHODS.CARET_POS:
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
      case WS_METHODS.EXIT:
        handleExit(data);
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
    const requestId: string = data.requestId;

    if (requestId in requestQueue) {
      requestQueue[requestId](data.data);

      setRequestQueue(prevState => {
        let newState = {...prevState};
        delete newState[requestId];
        return newState;
      })
    }
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

  function handleRunCodeResult(data) {
    console.log("*****RUN CODE RESULT*****");
    console.log(data);
    setResult(data.result);
    setIsCodeRunning(false);
  }

  function handleExit(data) {
    console.log("EXITING EDITOR ...");
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
    console.log("=====CODE CHANGE=======");

    setCode(val);

    console.log(val);

    // // TODO: Handle ops
    // sendJsonMessage({
    //   method: WS_METHODS.OP,
    //   op: val
    // });
  }

  function pause(time: number) {
    return new Promise<void>(resolve => setTimeout(resolve, time))
  }
  
  function currentLatency() {
    let base = 100
    return base * (1 + (Math.random() - 0.5))
  }
  
  class Connection {
    private disconnected: null | {wait: Promise<void>, resolve: () => void} = null
  
    constructor(
      private getLatency: () => number = currentLatency
    ) {}
  
    private _request(value: any): Promise<any> {
      return new Promise(resolve => {
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
        setRequestQueue(prevState => {
          return {
            ...prevState,
            [requestId]: resolve
          };
        });
      })
    }
  
    async request(value: any) {
      let latency = this.getLatency()
      if (this.disconnected) await this.disconnected.wait
      await pause(latency)
      let result = await this._request(value)
      if (this.disconnected) await this.disconnected.wait
      await pause(latency)
      return result
    }
  
    setConnected(value: boolean) {
      if (value && this.disconnected) {
        this.disconnected.resolve()
        this.disconnected = null
      } else if (!value && !this.disconnected) {
        let resolve, wait = new Promise<void>(r => resolve = r)
        this.disconnected = {wait, resolve}
      }
    }
  }
  
  function pushUpdates(
    connection: Connection,
    version: number,
    fullUpdates: readonly Update[], 
    lang: string
  ): Promise<boolean> {
    // Strip off transaction data
    let updates = fullUpdates.map(u => ({
      clientID: u.clientID,
      changes: u.changes.toJSON()
    }))
    return connection.request({type: "pushUpdates", version, updates, lang: lang})
  }
  
  function pullUpdates(
    connection: Connection,
    version: number, 
    lang: string
  ): Promise<readonly Update[]> {
    return connection.request({type: "pullUpdates", version, lang: lang})
      .then(updates => {
        return updates.map(u => ({
        changes: ChangeSet.fromJSON(u.changes),
        clientID: u.clientID
      }))})
  }
  
  function getDocument(
    connection: Connection,
    lang: string
  ): Promise<{version: number, doc: Text}> {
    return connection.request({type: "getDocument", lang: lang}).then(data => ({
      version: data.version,
      doc: Text.of(data.doc.split("\n"))
    }))
  }
    
  function peerExtension(startVersion: number, connection: Connection, lang: string) {
    let plugin = ViewPlugin.fromClass(class {
      private pushing = false
      private done = false
  
      constructor(private view: EditorView) { this.pull() }
  
      update(update: ViewUpdate) {
        if (update.docChanged) this.push()
      }
  
      async push() {
        let updates = sendableUpdates(this.view.state)
        if (this.pushing || !updates.length) return
        this.pushing = true
        let version = getSyncedVersion(this.view.state)
        await pushUpdates(connection, version, updates, lang)
        this.pushing = false
        // Regardless of whether the push failed or new updates came in
        // while it was running, try again if there's updates remaining
        if (sendableUpdates(this.view.state).length)
          setTimeout(() => this.push(), 100)
      }
  
      async pull() {
        while (!this.done) {
          let version = getSyncedVersion(this.view.state)
          let updates = await pullUpdates(connection, version, lang)
          this.view.dispatch(receiveUpdates(this.view.state, updates))
        }
      }
  
      destroy() { this.done = true }
    })
    return [collab({startVersion}), plugin]
  }
  
  //const worker = new Worker(workerScript)
  
  async function addPeer(lang: string, idx: number) {
    let {version, doc} = await getDocument(new Connection(), lang)
    let connection = new Connection()
    let state = EditorState.create({
      doc,
      extensions: [basicSetup, peerExtension(version, connection, lang)]
    })
    let editorDiv = editorsRef.current[idx];
    console.log(editorDiv)
    // TODO: Add 3 EditorViews one for each language
    // Display only the one for the selected language
    // This ensures version history is consistent for all languages
    new EditorView({state, parent: editorDiv})
    setIsCodeMirrorLoaded(true);
  }


  useEffect(() => {
    if (editorsRef.current !== null && isWebsocketLoaded && !isCodeMirrorLoaded) {
      console.log("CodeMirror Ref initialized and WebSocket is loaded");
      
      for (const idx in LANGUAGES) {
        console.log(LANGUAGES[idx], parseInt(idx))
        addPeer(LANGUAGES[idx], parseInt(idx));  
      }
    }
  }, [editorsRef, isWebsocketLoaded]);

  function onMouseUp(e) {
    console.log("=====MOUSE UP=======");
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
    sendJsonMessage({
      method: WS_METHODS.EXIT
    });
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
          <div id="editors" className="h-full w-full">
            {LANGUAGES.map((lang, i) => (
              <div 
                className={`h-full w-full overflow-y-scroll ${language === lang ? "visible" : "invisible max-h-0"}`}
                key={i}
                ref={el => editorsRef.current[i] = el}
              />
            ))}
          </div>
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
          <div className="h-full w-full p-3">
            {result}
          </div>
        </div>
      </Panel>
    </PanelGroup>
  );
}
