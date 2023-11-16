/**
 * Collection of utils related to questions
 */

import { QuestionComplexity } from "@/api/questions/types";

export const questionComplexityToTextColorMap = {
  [QuestionComplexity.EASY]: "text-green-500",
  [QuestionComplexity.MEDIUM]: "text-amber-500",
  [QuestionComplexity.HARD]: "text-red-600",
};
