import { QuestionComplexity } from "@/api/questions/types";
import { ChipProps } from "@nextui-org/react";

interface QuestionComplexityConfig {
  name: "Easy" | "Medium" | "Hard";
  color: ChipProps["color"];
}

export const QuestionComplexityConfigsMap: Record<
  QuestionComplexity,
  QuestionComplexityConfig
> = {
  [QuestionComplexity.EASY]: {
    name: "Easy",
    color: "success",
  },
  [QuestionComplexity.MEDIUM]: {
    name: "Medium",
    color: "warning",
  },
  [QuestionComplexity.HARD]: {
    name: "Hard",
    color: "danger",
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
