/* eslint-disable  @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import {
  CLASSNAME_MY_MESSAGE,
  CLASSNAME_PARTNER_MESSAGE,
  WSMessageDataType,
  WSMessageType,
  WS_METHODS,
} from "../constants";
import LoadingScreen from "../LoadingScreen";
import { Input } from "@nextui-org/react";
import { SendHorizontal } from "lucide-react";

interface MessageWindowProps {
  websocketUrl: string;
}

export default function MessageWindow(props: MessageWindowProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [messageValue, setMessageValue] = useState("");
  const [messageList, setMessageList] = useState<[string, boolean][]>([]);

  const messageInput = useRef<HTMLInputElement>(null);
  const messageScrollDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageScrollDiv.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  const { sendJsonMessage } = useWebSocket(props.websocketUrl, {
    share: true,
    filter: () => false,
    onOpen: () => {
      console.log("Messaging WS connection established");
    },
    onMessage: onMessage,
  });

  function onMessage(e: WSMessageType) {
    const data = JSON.parse(e.data);

    switch (data.method) {
      case WS_METHODS.READY_TO_RECEIVE:
        handleReadyToReceive(data);
        break;
      case WS_METHODS.MESSAGE:
        handleMessage(data);
        break;
    }
  }

  function handleReadyToReceive(data: WSMessageDataType) {
    setIsInitialized(true);
    setMessageList(data.messageList);
  }

  function handleMessage(data: WSMessageDataType) {
    addMessageToList(data.message, false);
  }

  function sendMessage() {
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
    setMessageList((prev) => {
      return [...prev, [message, isFromMe]];
    });
  }

  function onKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      sendMessage();
    }
  }

  return (
    <div className="flex flex-grow flex-col bg-content1 rounded-xl relative overflow-auto">
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
          endContent={<SendHorizontal onClick={sendMessage} />}
          value={messageValue}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
            setMessageValue(e.target.value)
          }
          onKeyUp={onKeyUp}
          ref={messageInput}
        />
      </div>
    </div>
  );
}
