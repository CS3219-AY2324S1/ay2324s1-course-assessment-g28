/* eslint-disable */
// @ts-nocheck TODO: fix the type errors in this file and remove this.
import { useEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import {
  CLASSNAME_MY_MESSAGE,
  CLASSNAME_PARTNER_MESSAGE,
  WS_METHODS,
} from "../constants";
import LoadingScreen from "../LoadingScreen";
import { Input } from "@nextui-org/react";
import sendIcon from "@/assets/images/chatbox-send-icon.png";

interface MessageWindowProps {
  websocketUrl: string;
}

export default function MessageWindow(props: MessageWindowProps) {
  const [isWebsocketLoaded, setIsWebsocketLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [messageValue, setMessageValue] = useState("");
  const [messageList, setMessageList] = useState([]);

  const messageInput = useRef(null);
  const messageScrollDiv = useRef(null);

  useEffect(() => {
    // TODO: Fix this
    messageScrollDiv.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  const { sendJsonMessage, readyState } = useWebSocket(props.websocketUrl, {
    share: true,
    filter: () => false,
    onOpen: () => {
      console.log("Messaging WS connection established");
      setIsWebsocketLoaded(true);
    },
    onMessage: onMessage,
    onError: onError,
  });

  function onMessage(e: any) {
    const data = JSON.parse(e.data);
    console.log("MessageWindow received: ", data);

    switch (data.method) {
      case WS_METHODS.READY:
        handleReady(data);
        break;
      case WS_METHODS.MESSAGE:
        handleMessage(data);
        break;
    }
  }

  function onError(e: Event) {
    // TODO: Handle error
  }

  function handleReady(data: any) {
    setIsInitialized(true);
  }

  function handleMessage(data: any) {
    console.log(data);
    addMessageToList(data.message, false);
  }

  function sendMessage() {
    console.log(messageValue);
    if (messageValue === "") {
      return;
    }

    sendJsonMessage({
      method: WS_METHODS.MESSAGE,
      message: messageValue,
    });

    addMessageToList(messageValue, true);
    setMessageValue("");
  }

  function addMessageToList(message: string, isFromMe: boolean) {
    // TODO: fix this...This definitely dosent look correct, the state types dont match at all...
    setMessageList((prev) => {
      return [...prev, [message, isFromMe]];
    });
  }

  function onKeyUp(e) {
    console.log(e.key);
    if (e.key === "Enter") {
      sendMessage();
    }
  }

  return (
    <div className="h-full w-full flex flex-col bg-content1 rounded-xl relative">
      {(() => {
        if (!isInitialized) {
          return (
            <LoadingScreen displayText="Initializing ChatBox"></LoadingScreen>
          );
        }
      })()}
      <div className="w-full flex grow flex-col overflow-y-scroll p-2 space-y-2">
        {messageList.map((val, idx) => (
          <div
            key={idx}
            className={
              val[1] ? CLASSNAME_MY_MESSAGE : CLASSNAME_PARTNER_MESSAGE
            }
          >
            {val[0]}
          </div>
        ))}
        <div ref={messageScrollDiv} />
      </div>
      <div className="w-full flex flex-row p-2">
        <Input
          placeholder="Send a message..."
          labelPlacement="outside"
          endContent={
            <img src={sendIcon.src} className="h-4/5" onClick={sendMessage} />
          }
          value={messageValue}
          onInput={(e) => setMessageValue(e.target.value)}
          onKeyUp={onKeyUp}
          ref={messageInput}
        />
      </div>
    </div>
  );
}
