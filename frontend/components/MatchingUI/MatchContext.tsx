import { getPairingServiceUri } from "@/api/pairing";
import { QuestionComplexity } from "@/api/questions/types";
import useUserInfo from "@/hooks/useUserInfo";
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
  pairingWebsocket: WebSocket | null;
  editorUri: string | null;
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
  pairingWebsocket: null,
  editorUri: null,
};

const MatchContext = createContext<MatchContextType>(defaultContext);

export const useMatchContext = () => useContext<MatchContextType>(MatchContext);

export const MatchContextProvider = ({
  children,
}: PropsWithChildren<unknown>) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pairingWebsocket, setPairingWebsocket] = useState<WebSocket | null>(
    null,
  );
  const [editorUri, setEditorUri] = useState<string | null>(null);
  const user = useUserInfo();
  const [selectedComplexity, setSelectComplexity] = useState<
    QuestionComplexity | undefined
  >();
  const [matchStatus, setMatchStatus] = useState<MatchStatus>(
    MatchStatus.SELECT_DIFFICULTY,
  );

  const redirectToRoom = () => {
    // todo redirect to room
  };

  const onChangeComplexity = async (complexity: QuestionComplexity) => {
    setSelectComplexity(complexity);
    setMatchStatus(MatchStatus.MATCHING);
    //TODO: adjust this
    const ws = new WebSocket(
      getPairingServiceUri({
        userId: user.user!.email!,
        complexity: selectedComplexity!,
      }),
    );
    ws.onmessage = (msg) => {
      try {
        let parsed = JSON.parse(msg.data);
        if (parsed.data.url) {
          setEditorUri(parsed.data.url);
          setMatchStatus(MatchStatus.MATCH_SUCCESS);
          ws.close();
        } else if (parsed.status == 200) {
          console.log(parsed);
        } else {
          setMatchStatus(MatchStatus.MATCH_ERROR);
          console.log(msg);
        }
      } catch (e) {
        setMatchStatus(MatchStatus.MATCH_ERROR);
        console.error(e);
      }
    };
    setPairingWebsocket(ws);
  };

  const onRetry = () => {
    setMatchStatus(MatchStatus.MATCHING);
    // todo call api
  };

  const onClose = () => {
    setIsModalOpen(false);
    pairingWebsocket?.close();
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
        editorUri,
        pairingWebsocket,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};
