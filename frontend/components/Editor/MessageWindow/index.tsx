import { useState } from "react";
import useWebSocket from "react-use-websocket";
import { WS_METHODS } from "../constants";
import LoadingScreen from "../LoadingScreen";

interface MessageWindowProps {
  websocketUrl: string,
}

export default function MessageWindow(props: MessageWindowProps) {

  const [isWebsocketLoaded, setIsWebsocketLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageDivs, setMessageDivs] = useState("");

  const { sendJsonMessage, readyState } = useWebSocket(props.websocketUrl, {
    share: true,
    filter: () => false,
    onOpen: () => {
      console.log("Messaging WS connection established");
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
      case WS_METHODS.MESSAGE:
        handleMessage(data);
        break;
    }
  }

  function onClose(e: Event) {
    console.log("CLOSING WS IN CHATBOX", e);
    // TODO
  }

  function onError(e: Event) {
    // TODO: Handle error
  }

  function handleReady(data) {
    setIsInitialized(true);
  }

  function handleMessage(data) {
    console.log(data);
  }

  function onSend(e) {
    sendJsonMessage({
      method: WS_METHODS.MESSAGE,
      message: "Test message"
    })
  }

  return (
    <div onClick={onSend} className="h-full w-full flex flex-col bg-white overflow-auto rounded-xl relative">
      {(() => {
        if (!isInitialized) {
          return (
            <LoadingScreen displayText="Initializing ChatBox"></LoadingScreen>
          );
        }
      })()}
      <div className="w-full flex flex-col">
        {messageDivs}
      </div>
      <div className="w-full flex flex-row">

      </div>
    </div>
  )
}
