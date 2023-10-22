import { QuestionComplexity } from "@/api/questions/types";
import { Chip } from "@nextui-org/react";
import { CSSProperties } from "react";
import cx from "classnames";
import { QuestionComplexityConfigsMap } from "@/api/questions/constants";

type ComplexityChipProps = {
  complexity: QuestionComplexity;
  className?: string;
  style?: CSSProperties;
};

const ComplexityChip = (props: ComplexityChipProps) => {
  const { complexity, className, style } = props ?? {};
  const { color, name } = QuestionComplexityConfigsMap?.[complexity] ?? {};
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
