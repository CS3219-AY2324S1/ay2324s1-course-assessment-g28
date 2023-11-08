import { ModalBody, ModalHeader } from "@nextui-org/react";
import { SubmissionStatus, useSubmissionContext } from "../SubmissionContext";
import { WS_METHODS } from "../../constants";
import Button from "@/components/Button";

/**
 * This card is only shown when submission status is:
 *  - EXIT_REJECTED OR
 *  - NEXT_QN_REJECTED
 */
const SubmissionRejectedCard = () => {
  const { stayOnQuestion, leaveQuestion } = useSubmissionContext();

  const submitAndExitMyself = () =>
    leaveQuestion(
      SubmissionStatus.SUBMIT_BEFORE_EXIT,
      WS_METHODS.PEER_HAS_EXITED,
    );

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">
        {"Your peer wishes to continue on working the question"}
      </ModalHeader>
      <ModalBody className="flex flex-col justify-between items-center gap-2">
        <div>
          Would you like to leave the session? Your attempt will still be saved
          and your peer will be notified.
        </div>
        <div className="flex gap-2 mb-4">
          <Button color="success" onClick={() => stayOnQuestion()}>
            Stay in session
          </Button>
          <Button color="danger" onClick={submitAndExitMyself}>
            Leave the session
          </Button>
        </div>
      </ModalBody>
    </>
  );
};

export default SubmissionRejectedCard;
