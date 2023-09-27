import { QuestionComplexity } from "@/api/questions/types";
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

export enum MatchStatus {
  SELECT_DIFFICULTY,
  MATCHING,
  MATCH_SUCCESS,
  MATCH_TIMEOUT,
  MATCH_ERROR,
}

type MatchContextType = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  matchStatus: MatchStatus;
  setMatchStatus: Dispatch<SetStateAction<MatchStatus>>;
  redirectToRoom: () => void;
  onChangeComplexity: (complexity: QuestionComplexity) => void;
  onRetry: () => void;
  onClose: () => void;
};

const defaultContext: MatchContextType = {
  isModalOpen: false,
  setIsModalOpen: () => {
    throw new Error("Not in provider!");
  },
  matchStatus: MatchStatus.SELECT_DIFFICULTY,
  setMatchStatus: () => {
    throw new Error("Not in provider!");
  },
  redirectToRoom: () => {
    throw new Error("Not in provider!");
  },
  onChangeComplexity: () => {
    throw new Error("Not in provider!");
  },
  onRetry: () => {
    throw new Error("Not in provider!");
  },
  onClose: () => {
    throw new Error("Not in provider!");
  },
};

const MatchContext = createContext<MatchContextType>(defaultContext);

export const useMatchContext = () => useContext<MatchContextType>(MatchContext);

export const MatchContextProvider = ({
  children,
}: PropsWithChildren<unknown>) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComplexity, setSelectComplexity] = useState<
    QuestionComplexity | undefined
  >();
  const [matchStatus, setMatchStatus] = useState<MatchStatus>(
    MatchStatus.SELECT_DIFFICULTY,
  );

  const redirectToRoom = () => {
    // todo redirect to room
  };

  const onChangeComplexity = (complexity: QuestionComplexity) => {
    setSelectComplexity(complexity);
    setMatchStatus(MatchStatus.MATCHING);
  };

  const onRetry = () => {
    setMatchStatus(MatchStatus.MATCHING);
    // todo call api
  };

  const onClose = () => {
    setIsModalOpen(false);
    setMatchStatus(MatchStatus.SELECT_DIFFICULTY);
    // todo: stop connecting
  };

  // do api call here and update matchStatus

  return (
    <MatchContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        matchStatus,
        setMatchStatus,
        redirectToRoom,
        onChangeComplexity,
        onRetry,
        onClose,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};
