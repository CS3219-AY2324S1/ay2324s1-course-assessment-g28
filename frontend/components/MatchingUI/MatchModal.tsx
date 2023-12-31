import { Button, Modal, ModalContent, ModalFooter } from "@nextui-org/react";
import cx from "classnames";
import MatchingCard from "./cards/Matching";
import SuccessCard from "./cards/SuccessCard";
import SelectDifficultyCard from "./cards/SelectDifficultyCard";
import ErrorCard from "../ErrorCard";
import { MatchStatus, useMatchContext } from "./MatchContext";
import TimeoutCard from "./cards/TimeoutCard";
import { CSSProperties } from "react";

export type MatchModalProps = {
  classNames?: string;
  style?: CSSProperties;
};

export const MatchModal = (props: MatchModalProps) => {
  const { classNames, style } = props ?? {};
  const { isModalOpen, setIsModalOpen, matchStatus, onClose } =
    useMatchContext();

  const switchContent = () => {
    switch (matchStatus) {
      case MatchStatus.SELECT_DIFFICULTY:
        return <SelectDifficultyCard />;
      case MatchStatus.MATCHING:
        return <MatchingCard />;
      case MatchStatus.MATCH_SUCCESS:
        return <SuccessCard />;
      case MatchStatus.MATCH_TIMEOUT:
        return <TimeoutCard />;
      case MatchStatus.MATCH_ERROR:
        return <ErrorCard />;
    }
  };

  const isHideCancelButton =
    matchStatus === MatchStatus.MATCH_SUCCESS ||
    matchStatus === MatchStatus.MATCH_TIMEOUT ||
    matchStatus === MatchStatus.MATCH_ERROR;

  return (
    <>
      <div className={cx("flex w-full justify-end ", classNames)} style={style}>
        <Button
          className="mb-2"
          color="danger"
          onClick={() => setIsModalOpen(true)}
        >
          Quick match!
        </Button>
      </div>
      <Modal
        hideCloseButton
        isOpen={isModalOpen}
        className="text-brand-white bg-gradient-to-br
        from-violet-500 to-fuchsia-500 flex flex-col items-center"
      >
        <ModalContent className="p-4">
          {switchContent()}
          {isHideCancelButton ? null : (
            <ModalFooter>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
