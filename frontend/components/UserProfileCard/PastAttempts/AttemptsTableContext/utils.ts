import { QuestionComplexity } from "@/api/questions/types";
import { ProcessedAttemptType } from ".";
import { ColumnKey } from "../AttemptsTable/config";
import { SortDescriptor } from "@nextui-org/react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { User } from "@/api/user/types";
import { DATETIME_FORMAT } from "../../config";

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);

enum SortDirection {
  ASCENDING = "ascending",
  DESCENDING = "descending",
}

export const DEFAULT_SORT = {
  column: ColumnKey.ATTEMPT_DATE,
  direction: SortDirection.DESCENDING,
};

export const PAGE_SIZE = 5;

export const formatDateData = (data: User) => {
  const { attemptedQuestions } = data ?? {};
  const formattedDateData = attemptedQuestions?.map((attempt) => ({
    ...attempt,
    attemptDateDayJS: dayjs(attempt.attemptDate),
    attemptDateString: dayjs(attempt.attemptDate).format(DATETIME_FORMAT),
  }));
  return formattedDateData ?? [];
};

export const filterByDifficulty = (
  attempts: Array<ProcessedAttemptType>,
  difficulty?: QuestionComplexity,
  filterValue?: string,
) => {
  return attempts.filter((attempt) => {
    const isNotSelectedDifficulty =
      difficulty !== undefined &&
      attempt?.questionDifficulty.toString() !== difficulty.toString();
    const isNotIncludesFilterVal =
      filterValue !== undefined &&
      !attempt?.questionTitle?.toLowerCase().includes(filterValue);
    const isFilteredOut = isNotSelectedDifficulty || isNotIncludesFilterVal;
    return !isFilteredOut;
  });
};

export const sortData = (
  arr: Array<ProcessedAttemptType>,
  sortDescriptor: SortDescriptor,
) => {
  const key = sortDescriptor.column as ColumnKey;
  switch (key) {
    case ColumnKey.QUESTION_ID:
      arr.sort((a, b) => a.questionId - b.questionId);
      break;
    case ColumnKey.QUESTION_TITLE:
      arr.sort((a, b) => {
        if (a.questionTitle < b.questionTitle) {
          return -1;
        } else if (a.questionTitle > b.questionTitle) {
          return 1;
        }
        return 0;
      });
      break;
    case ColumnKey.QUESTION_DIFFICULTY:
      arr.sort((a, b) => a.questionDifficulty - b.questionDifficulty);
      break;
    case ColumnKey.ATTEMPT_DATE:
      arr.sort((a, b) => {
        if (a.attemptDateDayJS.isSame(b.attemptDateString)) {
          return 0;
        }
        return a.attemptDateDayJS.isAfter(b.attemptDateString) ? 1 : -1;
      });
      break;
    case ColumnKey.ATTEMPT_LANGUAGE:
      arr.sort((a, b) => {
        if (a.attemptLanguage < b.attemptLanguage) {
          return -1;
        } else if (a.attemptLanguage > b.attemptLanguage) {
          return 1;
        }
        return 0;
      });
      break;
  }
  if (sortDescriptor.direction === SortDirection.DESCENDING) {
    arr.reverse();
  }
  return arr;
};

export const getPaginatedData = (
  data: Array<ProcessedAttemptType>,
  page: number,
) => {
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  return data.slice(startIndex, endIndex);
};
