import { User } from "@/api/user/types";

export const BE_DATE_FORMAT = "YYYY-DD-MM";
export const CHART_DATE_FORMAT = "YYYY-MM-DD";
export const DATETIME_FORMAT = "YYYY-MM-DD LTS";
export const UNDEFINED_VALUE = "--";

export const USER_ATTEMPTS_CONFIGS = [
  {
    id: "Easy",
    label: "Easy",
    color: "#84cc16",
    render: (data?: User) => data?.numEasyQuestionsAttempted ?? UNDEFINED_VALUE,
  },
  {
    id: "Medium",
    label: "Medium",
    color: "#f59e0b",
    render: (data?: User) =>
      data?.numMediumQuestionsAttempted ?? UNDEFINED_VALUE,
  },
  {
    id: "Hard",
    label: "Hard",
    color: "#dc2626",
    render: (data?: User) => data?.numHardQuestionsAttempted ?? UNDEFINED_VALUE,
  },
];
