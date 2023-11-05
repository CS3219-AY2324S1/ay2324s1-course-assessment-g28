import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { WSMessageType, WS_METHODS } from "../constants";
import useWebSocket from "react-use-websocket";
import toast from "react-hot-toast";

export enum SubmissionStatus {
  NOT_SUBMITTING,

  EXIT_INIIATED_BY_ME,
  EXIT_INITIATED_BY_PEER,
  EXIT_REJECTED,

  NEXT_QN_INITIATED_BY_ME,
  NEXT_QN_INITIATED_BY_PEER,
  NEXT_QN_REJECTED,

  SUBMIT_BEFORE_NEXT_QN,
  SUBMIT_BEFORE_EXIT,
}

type SubmissionContextType = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  submissionStatus: SubmissionStatus;
  setSubmissionStatus: Dispatch<SetStateAction<SubmissionStatus>>;
  initateExitMyself: () => void;
  stayInSession: (message?: WS_METHODS) => void;
  leaveSession: (message?: WS_METHODS) => void;
  websocketUrl: string;
  sendMessage: (msg: WS_METHODS) => void;
};

const defaultContext: SubmissionContextType = {
  isModalOpen: false,
  setIsModalOpen: () => {
    throw new Error("Not in provider!");
  },
  isLoading: false,
  setIsLoading: () => {
    throw new Error("Not in provider!");
  },
  submissionStatus: SubmissionStatus.NOT_SUBMITTING,
  setSubmissionStatus: () => {
    throw new Error("Not in provider!");
  },
  initateExitMyself: () => {
    throw new Error("Not in provider!");
  },
  stayInSession: () => {
    throw new Error("Not in provider!");
  },
  leaveSession: () => {
    throw new Error("Not in provider!");
  },
  websocketUrl: "",
  sendMessage: () => {
    throw new Error("Not in provider!");
  },
};

const SubmissionContext = createContext<SubmissionContextType>(defaultContext);

export const useSubmissionContext = () =>
  useContext<SubmissionContextType>(SubmissionContext);

export const SubmissionContextProvider = ({
  children,
  websocketUrl,
}: PropsWithChildren<{ websocketUrl: string }>) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    SubmissionStatus.EXIT_INIIATED_BY_ME,
  );
  console.log(websocketUrl);
  const { sendJsonMessage } = useWebSocket(websocketUrl, {
    share: true,
    filter: () => false,
    onOpen: () => {
      console.log("Submission WS connection established");
    },
    onMessage: onMessage,
  });

  function onMessage(e: WSMessageType) {
    console.log("submission:", e);
    const data = JSON.parse(e.data);
    switch (data.method) {
      // case WS_METHODS.NEXT_QUESTION_INITATED_BY_PEER:
      //   break;
      // case WS_METHODS.NEXT_QUESTION_CONFIRM:
      //   break;
      case WS_METHODS.EXIT_INITIATED_BY_PEER:
        handleExitInitiatedByPeer();
        break;
      case WS_METHODS.EXIT_CONFIRM:
        setSubmissionStatus(SubmissionStatus.SUBMIT_BEFORE_EXIT);
        break;
      case WS_METHODS.EXIT_REJECT:
        setSubmissionStatus(SubmissionStatus.EXIT_REJECTED);
        break;
      case WS_METHODS.PEER_HAS_EXITED:
        toast.success(
          "Your peer has left. You may continue working on the question alone.",
        );
        break;
    }
  }

  const sendMessage = (msg: WS_METHODS) => {
    console.log("sending message", msg);
    sendJsonMessage({
      method: msg,
    });
  };

  const initateExitMyself = () => {
    console.log("leave");
    sendJsonMessage({
      method: WS_METHODS.EXIT_INITIATED_BY_PEER,
    });
    sendMessage(WS_METHODS.EXIT_INITIATED_BY_PEER);
    setIsModalOpen(true);
    setSubmissionStatus(SubmissionStatus.EXIT_INIIATED_BY_ME);
  };

  const handleExitInitiatedByPeer = () => {
    setIsModalOpen(true);
    setSubmissionStatus(SubmissionStatus.EXIT_INITIATED_BY_PEER);
  };

  const stayInSession = (message?: WS_METHODS) => {
    console.log("staying. message:", message);
    if (message) {
      sendJsonMessage({
        method: message,
      });
    }
    setIsModalOpen(false);
    setSubmissionStatus(SubmissionStatus.NOT_SUBMITTING);
  };

  const leaveSession = (message?: WS_METHODS) => {
    if (message) {
      sendJsonMessage({
        method: message,
      });
    }
    setSubmissionStatus(SubmissionStatus.SUBMIT_BEFORE_EXIT);
  };

  return (
    <SubmissionContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        isLoading,
        setIsLoading,
        submissionStatus,
        setSubmissionStatus,
        initateExitMyself,
        stayInSession,
        leaveSession,
        websocketUrl,
        sendMessage,
      }}
    >
      {children}
    </SubmissionContext.Provider>
  );
};
