import { ModalBody, ModalHeader, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { SubmissionStatus, useSubmissionContext } from "../SubmissionContext";
import { WS_METHODS } from "../../constants";
import Button from "@/components/Button";

export const MAX_WAITING_DURATION = 10000;

const ExitInitiatedByMeCard = () => {
  const [isTimeout, setIsTimeout] = useState(false);
  // const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const { submissionStatus, stayInSession, leaveSession } =
    useSubmissionContext();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (submissionStatus === SubmissionStatus.EXIT_INIIATED_BY_ME) {
      timer = setTimeout(() => setIsTimeout(true), MAX_WAITING_DURATION);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [submissionStatus]);

  return isTimeout ? (
    <>
      <ModalHeader className="flex flex-col gap-1">
        {"Your peer did not respond"}
      </ModalHeader>
      <ModalBody className="flex flex-col justify-between items-center gap-2">
        <div>
          Would you like to leave the session? Your attempt will still be saved
          and your peer will be notified.
        </div>
        <div className="flex gap-2 mb-4">
          <Button color="success" onClick={() => stayInSession()}>
            Stay in session
          </Button>
          <Button
            color="danger"
            onClick={() => leaveSession(WS_METHODS.PEER_HAS_EXITED)}
          >
            Leave the session
          </Button>
        </div>
      </ModalBody>
    </>
  ) : (
    <>
      <ModalHeader className="flex flex-col gap-1">
        {"Awaiting peer's confirmation"}
      </ModalHeader>
      <ModalBody className="flex flex-col items-center gap-1">
        <div>{"Please wait a moment..."}</div>
        <Spinner color="secondary" />
      </ModalBody>
    </>
  );
};

export default ExitInitiatedByMeCard;
