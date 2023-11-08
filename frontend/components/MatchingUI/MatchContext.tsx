import { MAX_PAIRING_DURATION, getPairingServiceUri } from "@/api/pairing";
import { QuestionComplexity } from "@/api/questions/types";
import useUserInfo from "@/hooks/useUserInfo";
import { getEditorPath } from "@/routes";
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { useActiveEditingSessionContext } from "../ActiveSessions/ActiveEditingSessionContext";

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
  editorUrl: string;
  selectedComplexity: QuestionComplexity | undefined;
  onChangeComplexity: (complexity: QuestionComplexity) => void;
  onRetry: () => void;
  onClose: () => void;
  pairingWebsocket: WebSocket | null;
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
  selectedComplexity: QuestionComplexity.EASY,
  onChangeComplexity: () => {
    throw new Error("Not in provider!");
  },
  onRetry: () => {
    throw new Error("Not in provider!");
  },
  onClose: () => {
    throw new Error("Not in provider!");
  },
  pairingWebsocket: null,
  editorUrl: "",
};

const MatchContext = createContext<MatchContextType>(defaultContext);

export const useMatchContext = () => useContext<MatchContextType>(MatchContext);

export const MatchContextProvider = ({
  children,
}: PropsWithChildren<unknown>) => {
  const [editorUrl, setEditorUrl] = useState("");
  const { addEditingSession } = useActiveEditingSessionContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pairingWebsocket, setPairingWebsocket] = useState<WebSocket | null>(
    null,
  );
  const user = useUserInfo();
  const [selectedComplexity, setSelectComplexity] = useState<
    QuestionComplexity | undefined
  >();
  const [matchStatus, setMatchStatus] = useState<MatchStatus>(
    MatchStatus.SELECT_DIFFICULTY,
  );
  const [pairingTimer, setPairingTimer] = useState<NodeJS.Timeout>();

  const onChangeComplexity = async (complexity: QuestionComplexity) => {
    setSelectComplexity(complexity);
    setMatchStatus(MatchStatus.MATCHING);
    const ws = new WebSocket(
      getPairingServiceUri({
        userId: user.email!,
        complexity: complexity,
      }),
    );

    setPairingTimer(
      setTimeout(() => {
        ws.close();
        setMatchStatus(MatchStatus.MATCH_TIMEOUT);
        setPairingWebsocket(null);
      }, MAX_PAIRING_DURATION),
    );
    ws.onmessage = (msg) => {
      try {
        const parsed = JSON.parse(msg.data);
        if (parsed.status === 200) {
          if (typeof parsed.data.url !== "undefined") {
            setMatchStatus(MatchStatus.MATCH_SUCCESS);
            setEditorUrl(
              getEditorPath(
                parseInt(parsed.data.questionId as string),
                parsed.data.url as string,
              ),
            );
            // add this new session to active editor context
            addEditingSession(
              {
                websocketUrl: parsed.data.url as string,
                questionId: parseInt(parsed.data.questionId as string),
                email: parsed.data.otherUser as string,
                questionComplexity: selectedComplexity!,
              },
              true,
            );
            ws.close();
          }
        } else {
          setMatchStatus(MatchStatus.MATCH_ERROR);
          ws.close();
          clearTimeout(pairingTimer);
        }
      } catch (e) {
        setMatchStatus(MatchStatus.MATCH_ERROR);
        ws.close();
        console.error(e);
        clearTimeout(pairingTimer);
      }
    };
    setPairingWebsocket(ws);
  };

  const onRetry = () => {
    if (selectedComplexity === undefined) {
      setMatchStatus(MatchStatus.SELECT_DIFFICULTY);
    } else {
      onChangeComplexity(selectedComplexity);
    }
  };

  const onClose = () => {
    setIsModalOpen(false);
    pairingWebsocket?.close();
    clearTimeout(pairingTimer);
    setMatchStatus(MatchStatus.SELECT_DIFFICULTY);
  };

  return (
    <MatchContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        matchStatus,
        setMatchStatus,
        editorUrl,
        selectedComplexity,
        onChangeComplexity,
        onRetry,
        onClose,
        pairingWebsocket,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};
