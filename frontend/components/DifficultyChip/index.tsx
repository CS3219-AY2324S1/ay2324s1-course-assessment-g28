import { QuestionComplexity } from "@/api/questions/types";
import { Chip, ChipProps } from "@nextui-org/react";

const statusColorMap: Record<QuestionComplexity, ChipProps["color"]> = {
  [QuestionComplexity.EASY]: "success",
  [QuestionComplexity.MEDIUM]: "warning",
  [QuestionComplexity.HARD]: "danger",
};
