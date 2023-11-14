import { QuestionComplexity } from "@/api/questions/types";
import { Chip } from "@nextui-org/react";
import { CSSProperties } from "react";
import cx from "classnames";

type ComplexityChipProps = {
  complexity: QuestionComplexity;
  className?: string;
  style?: CSSProperties;
};

const complexityMap = {
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

const ComplexityChip = (props: ComplexityChipProps) => {
  const { complexity, className, style } = props ?? {};
  const { color, name } = complexityMap[complexity] ?? {};
  return (
    <Chip
      className={cx(
        "text-background bg-orange-400 font-bold",
        className,
        color,
      )}
      style={style}
    >
      {name}
    </Chip>
  );
};

export default ComplexityChip;
