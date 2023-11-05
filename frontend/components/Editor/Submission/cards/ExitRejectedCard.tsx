import { Button, ModalBody, ModalHeader } from "@nextui-org/react";
import { useSubmissionContext } from "../SubmissionContext";
import { WS_METHODS } from "../../constants";

const ExitRejected = () => {
  const { stayInSession, leaveSession } = useSubmissionContext();

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">
        {"Your peer wishes to continue the session"}
      </ModalHeader>
      <ModalBody className="flex flex-col justify-between items-center gap-2">
        <div>
          Would you like to leave the session? Your attempt will still be saved
          and your peer will be notified.
        </div>
        <div className="flex gap-2 mb-4">
          <Button
            color="success"
            className="text-foreground"
            onClick={() => stayInSession()}
          >
            Stay in session
          </Button>
          <Button
            color="danger"
            className="text-foreground"
            onClick={() => leaveSession(WS_METHODS.PEER_HAS_EXITED)}
          >
            Leave the session
          </Button>
        </div>
      </ModalBody>
    </>
  );
};

export default ExitRejected;
