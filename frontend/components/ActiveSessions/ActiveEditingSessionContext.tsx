import { getQuestion } from "@/api/questions";
import { getPublicUserInfo } from "@/api/user";
import { EditingSessionDetails } from "@/components/ActiveSessions";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface AddEditingSessionDetails {
  email: string; //email of the user to add
  sessionUrl: string;
  questionId: number;
}

export interface ActiveEditingSessionContextType {
  activeEditingSessions: EditingSessionDetails[];
  addEditingSession: (details: AddEditingSessionDetails) => Promise<void>;
  deleteEditingSession: (sessionUrl: string) => void;
}

const defaultContext: ActiveEditingSessionContextType = {
  activeEditingSessions: [],
  addEditingSession: async () => {
    throw new Error("Not in provider");
  },
  deleteEditingSession: () => {
    throw new Error("Not in provider");
  },
};

const ActiveEditingSessionContext =
  createContext<ActiveEditingSessionContextType>(defaultContext);

export const useActiveEditingSessionContext = () =>
  useContext(ActiveEditingSessionContext);

const activeEditingSessionsLocalStorageKey = "active_editing_sessions";

export const ActiveEditingSessionContextProvider = ({
  children,
}: PropsWithChildren<unknown>) => {
  const [activeEditingSessions, setActiveEditingSessions] = useState<
    EditingSessionDetails[]
  >([]);

  useEffect(() => {
    const persisted = localStorage.getItem(
      activeEditingSessionsLocalStorageKey,
    );
    if (persisted !== null && persisted !== "undefined") {
      setActiveEditingSessions(JSON.parse(persisted));
    }
  }, []);

  // persist active editing sessions to localstorage whenever it changes
  useEffect(() => {
    // save to local storage
    localStorage.setItem(
      activeEditingSessionsLocalStorageKey,
      JSON.stringify(activeEditingSessions),
    );
  }, [activeEditingSessions]);

  const addEditingSession = async (details: AddEditingSessionDetails) => {
    try {
      const userDetails = await getPublicUserInfo(details.email);
      const questionDetails = await getQuestion(details.questionId, false);
      const sessionDetails: EditingSessionDetails = {
        otherUser: userDetails,
        question: questionDetails,
        sessionUrl: details.sessionUrl,
      };
      setActiveEditingSessions((prv) => [...prv, sessionDetails]);
    } catch (e) {
      console.log("Error adding editing session: ", e);
    }
  };

  const deleteEditingSession = (sessionUrl: string) => {
    setActiveEditingSessions((prv) =>
      prv.filter((detail) => detail.sessionUrl !== sessionUrl),
    );
  };

  return (
    <ActiveEditingSessionContext.Provider
      value={{ activeEditingSessions, addEditingSession, deleteEditingSession }}
    >
      {children}
    </ActiveEditingSessionContext.Provider>
  );
};
