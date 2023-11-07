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
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { AttemptedQuestionRecord, User } from "@/api/user/types";
import { DATETIME_FORMAT } from "../../config";
import { filterByDifficulty as filterData } from "./utils";

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);

export const PAGE_SIZE = 5;

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

  const processedData = useMemo(() => {
    const { attemptedQuestions } = data ?? {};
    const formattedDateData = attemptedQuestions?.map((attempt) => ({
      ...attempt,
      attemptDateDayJS: dayjs(attempt.attemptDate),
      attemptDateString: dayjs(attempt.attemptDate).format(DATETIME_FORMAT),
    }));
    return formattedDateData ?? [];
  }, [data]);
  const sortedData = useMemo(() => {
    return [...processedData]?.sort((a, b) => {
      if (a.attemptDateDayJS.isSame(b.attemptDateString)) {
        return 0;
      }
      return a.attemptDateDayJS.isAfter(b.attemptDateString) ? -1 : 1;
    });
  }, [processedData]);

  const filteredData = useMemo(
    () => filterData(sortedData, selectedComplexity, filterValue),
    [sortedData, selectedComplexity, filterValue],
  );

  const totalPages = useMemo(
    () => Math.ceil(filteredData.length / PAGE_SIZE),
    [filteredData],
  );

  const attempts = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, page]);

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
        attempts,
        totalPages,
      }}
    >
      {children}
    </AttemptsTableContext.Provider>
  );
};
