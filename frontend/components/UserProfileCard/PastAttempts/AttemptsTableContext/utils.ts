import { QuestionComplexity } from "@/api/questions/types";
import { ProcessedAttemptType } from ".";

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
      !attempt?.questionTitle?.includes(filterValue);
    const isFilteredOut = isNotSelectedDifficulty || isNotIncludesFilterVal;
    return !isFilteredOut;
  });
};
