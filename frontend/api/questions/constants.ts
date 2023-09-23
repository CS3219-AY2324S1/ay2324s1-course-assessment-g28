import { QuestionComplexity } from "@/api/questions/types";

export const QuestionComplexityToNameMap: Record<QuestionComplexity, string> = {
  [QuestionComplexity.EASY]: "Easy",
  [QuestionComplexity.MEDIUM]: "Medium",
  [QuestionComplexity.HARD]: "Hard",
};
export const COMPLEXITY_OPTIONS = Object.keys(QuestionComplexityToNameMap).map(
  (key) => ({
    key,
    name: QuestionComplexityToNameMap[parseInt(key) as QuestionComplexity],
  }),
);
