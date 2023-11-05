import { ModalBody, ModalHeader } from "@nextui-org/react";
import { SubmissionStatus, useSubmissionContext } from "../SubmissionContext";
import { WS_METHODS } from "../../constants";
import { MAX_WAITING_DURATION } from "./SubmissionInitiatedByMeCard";
import { useEffect } from "react";
import Button from "@/components/Button";

type CardConfigs = {
  title: string;
  body: string;
  action: () => void;
  actionText: string;
};

/**
 * This card is only shown when submission status is:
 *  - EXIT_INITIATED_BY_PEER OR
 *  - NEXT_QN_INITIATED_BY_PEER
 */
const SubmissionInitiatedByPeerCard = () => {
  const {
    submissionStatus,
    setIsModalOpen,
    setSubmissionStatus,
    stayOnQuestion,
    leaveQuestion,
  } = useSubmissionContext();

  const submitAndExit = () =>
    leaveQuestion(SubmissionStatus.SUBMIT_BEFORE_EXIT, WS_METHODS.EXIT_CONFIRM);

  const submitAndGoToNextQn = () =>
    leaveQuestion(
      SubmissionStatus.SUBMIT_BEFORE_NEXT_QN,
      WS_METHODS.NEXT_QUESTION_CONFIRM,
    );

  useEffect(() => {
    const timer = setTimeout(() => {
      setSubmissionStatus(SubmissionStatus.NOT_SUBMITTING);
      setIsModalOpen(false);
    }, MAX_WAITING_DURATION - 1000);
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [setIsModalOpen, setSubmissionStatus]);

  const SubmissionStatusToContentMap: Record<
    | SubmissionStatus.EXIT_INITIATED_BY_PEER
    | SubmissionStatus.NEXT_QN_INITIATED_BY_PEER,
    CardConfigs
  > = {
    [SubmissionStatus.EXIT_INITIATED_BY_PEER]: {
      title: "Your peer would like to exit",
      body:
        "Would you like to leave the session? " +
        "Your attempt will still be saved " +
        "and your peer will be notified.\n",
      action: submitAndExit,
      actionText: "Exit the session",
    },
    [SubmissionStatus.NEXT_QN_INITIATED_BY_PEER]: {
      title: "Your peer would like to proceed to the next question",
      body:
        "Would you like to move on to the next question? " +
        "Your current attempt will be saved.",
      action: submitAndGoToNextQn,
      actionText: "Proceed to next question",
    },
  };

  if (
    submissionStatus !== SubmissionStatus.EXIT_INITIATED_BY_PEER &&
    submissionStatus !== SubmissionStatus.NEXT_QN_INITIATED_BY_PEER
  ) {
    // this card is only shown when submission status is
    // EXIT_INITIATED_BY_PEER || NEXT_QN_INITIATED_BY_PEER
    return null;
  }
  const { title, body, action, actionText } =
    SubmissionStatusToContentMap[submissionStatus];

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
      <ModalBody className="flex flex-col justify-between items-center gap-2">
        <div>{body}</div>
        <div>
          You may choose to stay and continue working on the question alone.
        </div>
        <div className="flex gap-2 mb-4">
          <Button
            color="success"
            onClick={() => stayOnQuestion(WS_METHODS.EXIT_REJECT)}
          >
            Stay in session
          </Button>
          <Button color="danger" onClick={action}>
            {actionText}
          </Button>
        </div>
      </ModalBody>
    </>
  );
};

export default SubmissionInitiatedByPeerCard;
