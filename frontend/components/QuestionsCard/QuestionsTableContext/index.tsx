import { QuestionComplexity } from "@/api/questions/types";
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { DEFAULT_PAGE_SIZE_SELECTION } from "../QuestionsTable/config";

type QuestionTableContextType = {
  filterValue: string;
  setFilterValue: Dispatch<SetStateAction<string>>;
  selectedComplexity: QuestionComplexity | undefined;
  setSelectedComplexity: Dispatch<
    SetStateAction<QuestionComplexity | undefined>
  >;
  pageSize: number;
  setPageSize: Dispatch<SetStateAction<number>>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  resetQuestionTableOptions: () => void;
};

const defaultContext: QuestionTableContextType = {
  filterValue: "",
  setFilterValue: () => {
    throw new Error("Not in provider!");
  },
  selectedComplexity: undefined,
  setSelectedComplexity: () => {
    throw new Error("Not in provider!");
  },
  pageSize: DEFAULT_PAGE_SIZE_SELECTION,
  setPageSize: () => {
    throw new Error("Not in provider!");
  },
  page: 1,
  setPage: () => {
    throw new Error("Not in provider!");
  },
  resetQuestionTableOptions: () => {
    throw new Error("Not in provider!");
  },
};

const QuestionTableContext =
  createContext<QuestionTableContextType>(defaultContext);

export const useQuestionTableContext = () =>
  useContext<QuestionTableContextType>(QuestionTableContext);

export const QuestionTableProvider = ({
  children,
}: PropsWithChildren<unknown>) => {
  const [filterValue, setFilterValue] = useState("");
  const [selectedComplexity, setSelectedComplexity] =
    useState<QuestionComplexity>();
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE_SELECTION);
  const [page, setPage] = useState(1);

  const resetQuestionTableOptions = useCallback(() => {
    setFilterValue("");
    setSelectedComplexity(undefined);
    setPageSize(DEFAULT_PAGE_SIZE_SELECTION);
    setPage(1);
  }, []);

  return (
    <QuestionTableContext.Provider
      value={{
        filterValue,
        setFilterValue,
        selectedComplexity,
        setSelectedComplexity,
        pageSize,
        setPageSize,
        page,
        setPage,
        resetQuestionTableOptions,
      }}
    >
      {children}
    </QuestionTableContext.Provider>
  );
};
