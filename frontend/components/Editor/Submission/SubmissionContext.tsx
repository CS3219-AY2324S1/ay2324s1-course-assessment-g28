import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { WSMessageType, WS_METHODS } from "../constants";
import useWebSocket from "react-use-websocket";
import toast from "react-hot-toast";
import { getEditorPath } from "@/routes";

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
  isPeerStillHere: boolean;
  setIsPeerStillHere: Dispatch<SetStateAction<boolean>>;
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  submissionStatus: SubmissionStatus;
  setSubmissionStatus: Dispatch<SetStateAction<SubmissionStatus>>;
  initateExitMyself: () => void;
  initateNextQnMyself: () => void;
  isSubmitted: boolean;
  setIsSubmitted: Dispatch<SetStateAction<boolean>>;
  nextQuestionPath: string;
  stayOnQuestion: (wsMethod?: WS_METHODS) => void;
  leaveQuestion: (
    nextState:
      | SubmissionStatus.SUBMIT_BEFORE_EXIT
      | SubmissionStatus.SUBMIT_BEFORE_NEXT_QN,
    wsMethod?: WS_METHODS,
  ) => void;
  websocketUrl: string;
  sendMessage: (msg: WS_METHODS) => void;
};

const throwNotInProviderError = () => {
  throw new Error("Not in provider!");
};
const defaultContext: SubmissionContextType = {
  isPeerStillHere: true,
  setIsPeerStillHere: throwNotInProviderError,
  isModalOpen: false,
  setIsModalOpen: throwNotInProviderError,
  submissionStatus: SubmissionStatus.NOT_SUBMITTING,
  setSubmissionStatus: throwNotInProviderError,
  initateExitMyself: throwNotInProviderError,
  initateNextQnMyself: throwNotInProviderError,
  isSubmitted: false,
  setIsSubmitted: throwNotInProviderError,
  nextQuestionPath: "",
  stayOnQuestion: throwNotInProviderError,
  leaveQuestion: throwNotInProviderError,
  websocketUrl: "",
  sendMessage: throwNotInProviderError,
};

const SubmissionContext = createContext<SubmissionContextType>(defaultContext);

export const useSubmissionContext = () =>
  useContext<SubmissionContextType>(SubmissionContext);

export const SubmissionContextProvider = ({
  children,
  websocketUrl,
}: PropsWithChildren<{ websocketUrl: string }>) => {
  const [isPeerStillHere, setIsPeerStillHere] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [nextQuestionPath, setNextQuestionPath] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    SubmissionStatus.NOT_SUBMITTING,
  );
  const { sendJsonMessage } = useWebSocket(websocketUrl, {
    share: true,
    filter: () => false,
    onMessage: onMessage,
  });

  useEffect(() => {
    // User has submitted code, now ask websocket for next qn url
    if (
      isSubmitted &&
      submissionStatus === SubmissionStatus.SUBMIT_BEFORE_NEXT_QN
    ) {
      sendMessage(WS_METHODS.NEXT_QUESTION_ID);
    }
  }, [isSubmitted, submissionStatus]);

  function onMessage(e: WSMessageType) {
    const data = JSON.parse(e.data);
    switch (data.method) {
      case WS_METHODS.EXIT_INITIATED_BY_PEER:
        return handleExitInitiatedByPeer();
      case WS_METHODS.EXIT_CONFIRM:
        return setSubmissionStatus(SubmissionStatus.SUBMIT_BEFORE_EXIT);
      case WS_METHODS.EXIT_REJECT:
        return setSubmissionStatus(SubmissionStatus.EXIT_REJECTED);
      case WS_METHODS.PEER_DISCONNECTED:
      case WS_METHODS.PEER_HAS_EXITED:
        setIsPeerStillHere(false);
        return toast.success(
          "Your peer has left. You may continue working on the question alone.",
        );

      case WS_METHODS.NEXT_QUESTION_INITATED_BY_PEER:
        return handleNextQnInitiatedByPeer();
      case WS_METHODS.NEXT_QUESTION_CONFIRM:
        return setSubmissionStatus(SubmissionStatus.SUBMIT_BEFORE_NEXT_QN);
      case WS_METHODS.NEXT_QUESTION_ID:
        return handleNextQuestionId(data);
    }
  }

  const sendMessage = (msg: WS_METHODS) => {
    sendJsonMessage({
      method: msg,
    });
  };

  const initateExitMyself = () => {
    setIsModalOpen(true);
    if (isPeerStillHere) {
      sendMessage(WS_METHODS.EXIT_INITIATED_BY_PEER);
      setSubmissionStatus(SubmissionStatus.EXIT_INIIATED_BY_ME);
    } else {
      setSubmissionStatus(SubmissionStatus.SUBMIT_BEFORE_EXIT);
    }
  };

  const handleExitInitiatedByPeer = () => {
    setIsModalOpen(true);
    setSubmissionStatus(SubmissionStatus.EXIT_INITIATED_BY_PEER);
  };

  const initateNextQnMyself = () => {
    setIsModalOpen(true);
    if (isPeerStillHere) {
      sendMessage(WS_METHODS.NEXT_QUESTION_INITATED_BY_PEER);
      setSubmissionStatus(SubmissionStatus.NEXT_QN_INITIATED_BY_ME);
    } else {
      setSubmissionStatus(SubmissionStatus.SUBMIT_BEFORE_NEXT_QN);
    }
  };

  const handleNextQnInitiatedByPeer = () => {
    setIsModalOpen(true);
    setSubmissionStatus(SubmissionStatus.NEXT_QN_INITIATED_BY_PEER);
  };

  const handleNextQuestionId = (data: {
    method: WS_METHODS;
    questionId: number;
  }) => {
    console.log("Received next qn details:", data);
    const questionId = data.questionId;
    const newPath = getEditorPath(questionId, encodeURIComponent(websocketUrl));
    console.log("Next question path:", newPath);
    setNextQuestionPath(newPath);
  };

  const stayOnQuestion = (message?: WS_METHODS) => {
    if (message) sendMessage(message);
    setIsModalOpen(false);
    setSubmissionStatus(SubmissionStatus.NOT_SUBMITTING);
  };

  const leaveQuestion = (nextState: SubmissionStatus, message?: WS_METHODS) => {
    if (message) sendMessage(message);
    setSubmissionStatus(nextState);
  };

  return (
    <SubmissionContext.Provider
      value={{
        isPeerStillHere,
        setIsPeerStillHere,
        isModalOpen,
        setIsModalOpen,
        submissionStatus,
        setSubmissionStatus,
        initateExitMyself,
        initateNextQnMyself,
        isSubmitted: isSubmitted,
        setIsSubmitted: setIsSubmitted,
        nextQuestionPath,
        stayOnQuestion,
        leaveQuestion,
        websocketUrl,
        sendMessage,
      }}
    >
      {children}
    </SubmissionContext.Provider>
  );
};
