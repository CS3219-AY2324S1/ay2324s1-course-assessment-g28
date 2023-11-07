import { QuestionComplexity } from "@/api/questions/types";
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AttemptedQuestionRecord, User } from "@/api/user/types";
import {
  DEFAULT_SORT,
  PAGE_SIZE,
  filterByDifficulty as filterData,
  formatDateData,
  getPaginatedData,
  sortData,
} from "./utils";
import { SortDescriptor } from "@nextui-org/react";
import dayjs from "dayjs";

export type ProcessedAttemptType = AttemptedQuestionRecord & {
  attemptDateDayJS: dayjs.Dayjs;
  attemptDateString: string;
};

type AttemptsTableContextType = {
  filterValue: string;
  setFilterValue: Dispatch<SetStateAction<string>>;
  selectedComplexity: QuestionComplexity | undefined;
  setSelectedComplexity: Dispatch<
    SetStateAction<QuestionComplexity | undefined>
  >;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  sortDescriptor: SortDescriptor;
  setSortDescriptor: Dispatch<SetStateAction<SortDescriptor>>;
  attempts: Array<ProcessedAttemptType>;
  totalPages: number;
};

const defaultContext: AttemptsTableContextType = {
  filterValue: "",
  setFilterValue: () => {
    throw new Error("Not in provider!");
  },
  selectedComplexity: undefined,
  setSelectedComplexity: () => {
    throw new Error("Not in provider!");
  },
  page: 1,
  setPage: () => {
    throw new Error("Not in provider!");
  },
  sortDescriptor: DEFAULT_SORT,
  setSortDescriptor: () => {
    throw new Error("Not in provider!");
  },
  attempts: [],
  totalPages: 0,
};

const AttemptsTableContext =
  createContext<AttemptsTableContextType>(defaultContext);

export const useAttemptsTableContext = () =>
  useContext<AttemptsTableContextType>(AttemptsTableContext);

export const AttemptsTableProvider = ({
  children,
  data,
}: PropsWithChildren<{ data: User }>) => {
  const [filterValue, setFilterValue] = useState("");
  const [selectedComplexity, setSelectedComplexity] =
    useState<QuestionComplexity>();
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] =
    useState<SortDescriptor>(DEFAULT_SORT);

  const processedData = useMemo(() => formatDateData(data), [data]);

  const sortedData = useMemo(
    () => sortData([...processedData], sortDescriptor),
    [processedData, sortDescriptor],
  );

  const filteredData = useMemo(
    () => filterData(sortedData, selectedComplexity, filterValue),
    [sortedData, selectedComplexity, filterValue],
  );

  const totalPages = useMemo(
    () => Math.ceil(filteredData.length / PAGE_SIZE),
    [filteredData],
  );

  const paginatedData = useMemo(
    () => getPaginatedData(filteredData, page),
    [filteredData, page],
  );

  useEffect(() => setPage(1), [selectedComplexity, filterValue]);

  return (
    <AttemptsTableContext.Provider
      value={{
        filterValue,
        setFilterValue,
        selectedComplexity,
        setSelectedComplexity,
        page,
        setPage,
        sortDescriptor,
        setSortDescriptor,
        attempts: paginatedData,
        totalPages,
      }}
    >
      {children}
    </AttemptsTableContext.Provider>
  );
};
