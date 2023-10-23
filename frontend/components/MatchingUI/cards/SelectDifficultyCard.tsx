import { COMPLEXITY_OPTIONS } from "@/api/questions/constants";
import { Button, ModalBody, ModalHeader } from "@nextui-org/react";
import { useMatchContext } from "../MatchContext";
import cx from "classnames";

const SelectDifficultyCard = () => {
  const { onChangeComplexity } = useMatchContext();
  return (
    <>
      <ModalHeader className="flex flex-col gap-1">
        Choose a difficulty!
      </ModalHeader>
      <ModalBody className="w-full pt-10">
        {COMPLEXITY_OPTIONS.map((complexity) => (
          <Button
            className={cx(
              "w-full text-white font-bold",
              "hover:scale-105 hover:transition-transform",
              complexity.color,
            )}
            key={complexity.key}
            onClick={() => onChangeComplexity(complexity.key)}
          >
            {complexity.name}
          </Button>
        ))}
      </ModalBody>
    </>
  );
};

export default SelectDifficultyCard;
