import { QuestionComplexity } from "@/api/questions/types";

interface QuestionComplexityConfig {
  name: "Easy" | "Medium" | "Hard";
  color: string;
}

export const QuestionComplexityConfigsMap: Record<
  QuestionComplexity,
  QuestionComplexityConfig
> = {
  [QuestionComplexity.EASY]: {
    name: "Easy",
    color: "bg-lime-500",
  },
  [QuestionComplexity.MEDIUM]: {
    name: "Medium",
    color: "bg-orange-400",
  },
  [QuestionComplexity.HARD]: {
    name: "Hard",
    color: "bg-red-600",
  },
};
export const COMPLEXITY_OPTIONS = Object.keys(QuestionComplexityConfigsMap).map(
  (key) => ({
    key: parseInt(key) as QuestionComplexity,
    ...QuestionComplexityConfigsMap[parseInt(key) as QuestionComplexity],
  }),
);

export function getQuestionErrorMessageFromErrorCode(errorCode: number) {
  switch (errorCode) {
    case 1:
      return "A question with the given title already exists.";
    default:
      return "Something went wrong. Please try again.";
  }
}
