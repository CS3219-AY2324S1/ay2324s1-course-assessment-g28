import { QuestionComplexity } from "@/api/questions/types";
import { Chip, ChipProps } from "@nextui-org/react";
import { CSSProperties } from "react";
import cx from "classnames";

const complexityConfigs: Record<
  QuestionComplexity,
  { color: ChipProps["color"]; text: "Easy" | "Medium" | "Hard" }
> = {
  [QuestionComplexity.EASY]: { color: "success", text: "Easy" },
  [QuestionComplexity.MEDIUM]: { color: "warning", text: "Medium" },
  [QuestionComplexity.HARD]: { color: "danger", text: "Hard" },
};

type ComplexityChipProps = {
  complexity: QuestionComplexity;
  className?: string;
  style?: CSSProperties;
};

const ComplexityChip = (props: ComplexityChipProps) => {
  const { complexity, className, style } = props ?? {};
  const { color, text } = complexityConfigs?.[complexity] ?? {};
  return (
    <Chip
      color={color}
      className={cx("text-brand-white font-bold", className)}
      style={style}
    >
      {text}
    </Chip>
  );
};

export default ComplexityChip;
