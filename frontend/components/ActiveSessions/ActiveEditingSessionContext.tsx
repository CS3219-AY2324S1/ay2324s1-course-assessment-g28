import { getQuestion } from "@/api/questions";
import { QuestionComplexity } from "@/api/questions/types";
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
  websocketUrl: string;
  questionId: number;
  questionComplexity: QuestionComplexity;
}

export interface ActiveEditingSessionContextType {
  activeEditingSessions: EditingSessionDetails[];
  addEditingSession: (
    details: AddEditingSessionDetails,
    isCurrentSession: boolean,
  ) => Promise<void>;
  updateEditingSession: (
    details: AddEditingSessionDetails,
    isCurrentSession: boolean,
  ) => Promise<void>;
  deleteEditingSession: (websocketUrl: string) => void;
  currentEditingSession: EditingSessionDetails | undefined;
}

const defaultContext: ActiveEditingSessionContextType = {
  activeEditingSessions: [],
  addEditingSession: async () => {
    throw new Error("Not in provider");
  },
  updateEditingSession: async () => {
    throw new Error("Not in provider");
  },
  deleteEditingSession: () => {
    throw new Error("Not in provider");
  },
  currentEditingSession: undefined,
};

const ActiveEditingSessionContext =
  createContext<ActiveEditingSessionContextType>(defaultContext);

export const useActiveEditingSessionContext = () =>
  useContext(ActiveEditingSessionContext);

const activeEditingSessionsLocalStorageKey = "active_editing_sessions";
const currentEditingSessionLocalStorageKey = "current_editing_session";

export const ActiveEditingSessionContextProvider = ({
  children,
}: PropsWithChildren<unknown>) => {
  const [activeEditingSessions, setActiveEditingSessions] = useState<
    EditingSessionDetails[]
  >([]);
  const [currentEditingSession, setCurrentEditingSession] =
    useState<EditingSessionDetails>();

  useEffect(() => {
    const persisted = localStorage.getItem(
      activeEditingSessionsLocalStorageKey,
    );
    if (persisted !== null && persisted !== "undefined") {
      setActiveEditingSessions(JSON.parse(persisted));
    }

    // Refresh will trigger this to obtain current session
    // This is needed as we refresh when proceed to next question
    // Will also be called during initial page load but doesn't matter
    const currentPersistedSession = localStorage.getItem(
      currentEditingSessionLocalStorageKey,
    );
    if (
      currentPersistedSession !== null &&
      currentPersistedSession !== "undefined"
    ) {
      setCurrentEditingSession(JSON.parse(currentPersistedSession));
    }
  }, []);

  // Always persist current session so we know what to load upon refresh
  useEffect(() => {
    // save to local storage
    localStorage.setItem(
      currentEditingSessionLocalStorageKey,
      JSON.stringify(currentEditingSession),
    );
  }, [currentEditingSession]);

  // persist active editing sessions to localstorage whenever it changes
  useEffect(() => {
    // save to local storage
    localStorage.setItem(
      activeEditingSessionsLocalStorageKey,
      JSON.stringify(activeEditingSessions),
    );
  }, [activeEditingSessions]);

  const addEditingSession = async (
    details: AddEditingSessionDetails,
    isCurrentSession: boolean,
  ) => {
    try {
      const userDetails = await getPublicUserInfo(details.email);
      const questionDetails = await getQuestion(details.questionId, false);
      const sessionDetails: EditingSessionDetails = {
        otherUser: userDetails,
        email: details.email,
        question: questionDetails,
        websocketUrl: details.websocketUrl,
        questionComplexity: details.questionComplexity,
      };
      setActiveEditingSessions((prv) => [...prv, sessionDetails]);
      if (isCurrentSession) {
        setCurrentEditingSession(sessionDetails);
      }
    } catch (e) {
      console.log("Error adding editing session: ", e);
    }
  };

  const updateEditingSession = async (
    details: AddEditingSessionDetails,
    isCurrentSession: boolean,
  ) => {
    const sessionToUpdate = activeEditingSessions.find(
      (session) => session.websocketUrl === details.websocketUrl,
    );
    if (sessionToUpdate === undefined) {
      return;
    }
    try {
      const userDetails = await getPublicUserInfo(details.email);
      const questionDetails = await getQuestion(details.questionId, false);
      sessionToUpdate.otherUser = userDetails;
      sessionToUpdate.email = details.email;
      sessionToUpdate.question = questionDetails;
      sessionToUpdate.questionComplexity = details.questionComplexity;
      sessionToUpdate.websocketUrl = details.websocketUrl;

      if (isCurrentSession) {
        setCurrentEditingSession(sessionToUpdate);
      }
    } catch (e) {
      console.log("Error updating editing session: ", e);
    }
  };

  const deleteEditingSession = (websocketUrl: string) => {
    setActiveEditingSessions((prv) =>
      prv.filter((detail) => detail.websocketUrl !== websocketUrl),
    );
  };

  return (
    <ActiveEditingSessionContext.Provider
      value={{
        activeEditingSessions,
        addEditingSession,
        updateEditingSession,
        deleteEditingSession,
        currentEditingSession,
      }}
    >
      {children}
    </ActiveEditingSessionContext.Provider>
  );
};
