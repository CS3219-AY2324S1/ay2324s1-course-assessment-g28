import { ModalBody, ModalHeader } from "@nextui-org/react";
import { SubmissionStatus, useSubmissionContext } from "../SubmissionContext";
import { WS_METHODS } from "../../constants";
import { MAX_WAITING_DURATION } from "./ExitInitiatedByMeCard";
import { useEffect } from "react";
import Button from "@/components/Button";

const ExitInitiatedByPeerCard = () => {
  const { setIsModalOpen, setSubmissionStatus, stayInSession, leaveSession } =
    useSubmissionContext();

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

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">
        Your peer would like to exit
      </ModalHeader>
      <ModalBody className="flex flex-col justify-between items-center gap-2">
        <div>
          Would you like to leave the session? Your attempt will still be saved
          and your peer will be notified.
        </div>
        <div>
          You may choose to stay and continue working on the question alone.
        </div>
        <div className="flex gap-2 mb-4">
          <Button
            color="success"
            onClick={() => stayInSession(WS_METHODS.EXIT_REJECT)}
          >
            Stay in session
          </Button>
          <Button
            color="danger"
            onClick={() => leaveSession(WS_METHODS.EXIT_CONFIRM)}
          >
            Leave the session
          </Button>
        </div>
      </ModalBody>
    </>
  );
};

export default ExitInitiatedByPeerCard;
