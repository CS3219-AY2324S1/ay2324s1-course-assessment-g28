import { QuestionComplexity } from "@/api/questions/types";
import ComplexityChip from "@/components/ComplexityChip";
import { ProcessedAttemptType } from "../AttemptsTableContext";
import { ReactNode } from "react";
import { UNDEFINED_VALUE } from "../../config";
import { FaUserFriends } from "react-icons/fa";
import { BsFillPersonFill } from "react-icons/bs";
import { Tooltip } from "@nextui-org/react";

export enum ColumnKey {
  QUESTION_ID = "questionId",
  QUESTION_TITLE = "questionTitle",
  QUESTION_DIFFICULTY = "questionDifficulty",
  ATTEMPT_DATE = "attemptDateString",
  ATTEMPT_LANGUAGE = "attemptLanguage",
  OTHER_USER = "otherUser",
}

interface ColumnConfig {
  name: ReactNode;
  uid: ColumnKey;
  sortable?: boolean;
  render?: (rowData: ProcessedAttemptType) => React.ReactNode;
  align: "start" | "center" | "end";
  width?: number;
}

export const COLUMNS = [
  ColumnKey.QUESTION_ID,
  ColumnKey.QUESTION_TITLE,
  ColumnKey.QUESTION_DIFFICULTY,
  ColumnKey.ATTEMPT_DATE,
  ColumnKey.ATTEMPT_LANGUAGE,
  ColumnKey.OTHER_USER,
];

export const COLUMN_CONFIGS: Record<ColumnKey, ColumnConfig> = {
  [ColumnKey.QUESTION_ID]: {
    name: "Qn.",
    uid: ColumnKey.QUESTION_ID,
    align: "center",
    width: 5,
    render: (attempt: ProcessedAttemptType) => (
      <div className="text-center">{attempt?.questionId}</div>
    ),
  },
  [ColumnKey.QUESTION_TITLE]: {
    name: "Title",
    uid: ColumnKey.QUESTION_TITLE,
    render: (attempt: ProcessedAttemptType) => (
      <div className="w-[120px] truncate">{attempt?.questionTitle}</div>
    ),
    align: "start",
  },
  [ColumnKey.QUESTION_DIFFICULTY]: {
    name: "Difficuty",
    uid: ColumnKey.QUESTION_DIFFICULTY,
    render: (attempt: ProcessedAttemptType) => (
      <ComplexityChip
        className="text-[10px]"
        complexity={attempt?.questionDifficulty}
      />
    ),
    align: "center",
  },
  [ColumnKey.ATTEMPT_DATE]: {
    name: "Date",
    uid: ColumnKey.ATTEMPT_DATE,
    render: (attempt: ProcessedAttemptType) => {
      if (!attempt?.attemptDateString) {
        return UNDEFINED_VALUE;
      }
      const [date, time, amOrPm] = attempt.attemptDateString.split(" ");
      return (
        <div className="flex flex-col text-[10px]">
          <span className="whitespace-nowrap">{date}</span>
          <div className="text-default-400">
            <span>{time}</span>
            <span>{amOrPm}</span>
          </div>
        </div>
      );
    },
    align: "start",
  },
  [ColumnKey.ATTEMPT_LANGUAGE]: {
    name: "Language",
    uid: ColumnKey.ATTEMPT_LANGUAGE,
    render: (attempt: ProcessedAttemptType) => (
      <div className="text-center">{attempt.attemptLanguage}</div>
    ),
    align: "start",
  },
  [ColumnKey.OTHER_USER]: {
    name: "Mode",
    uid: ColumnKey.OTHER_USER,
    render: (attempt: ProcessedAttemptType) => (
      <Tooltip
        content={
          attempt?.otherUser ? "Attempted with a peer" : "Attempted by youself"
        }
      >
        <div className="relative flex justify-center">
          {attempt?.otherUser ? <FaUserFriends /> : <BsFillPersonFill />}
        </div>
      </Tooltip>
    ),
    align: "center",
  },
};

export const DEFAULT_COMPLEXITY_SELECTION = QuestionComplexity.EASY;

export const PAGE_SIZE_OPTIONS = [{ name: 10 }, { name: 20 }, { name: 50 }];

export const DEFAULT_PAGE_SIZE_SELECTION = 10;

export const questionFilterRegex = /[^0-9a-z\-_]+/i;

export const customClassNames = {
  base: ["gap-0"],
  wrapper: [
    "h-[280px] p-0 my-[12px] rounded-none border-none shadow-none",
    "bg-transparent overflow-y-hidden",
  ],
  th: [
    "whitespace-break-spaces bg-transparent text-foreground",
    "border-b border-divider px-[5px] text-xs font-normal",
  ],

  td: ["rounded-none text-xs px-[5px]"],
};
