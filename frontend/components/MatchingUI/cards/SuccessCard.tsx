import { ModalBody, ModalHeader } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useMatchContext } from "../MatchContext";

const SuccessCard = () => {
  const [secondsLeft, setSecondsLeft] = useState(5);
  const { redirectToRoom } = useMatchContext();

  useEffect(() => {
    if (secondsLeft < 1) {
      return redirectToRoom();
    }
    setTimeout(() => setSecondsLeft((currSeconds) => currSeconds - 0.05), 50);
  }, [secondsLeft, redirectToRoom]);

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Success!</ModalHeader>
      <ModalBody>
        <div>{`Redirecting you in ${Math.floor(secondsLeft)} second${
          secondsLeft === 1 ? "" : "s"
        }...`}</div>
      </ModalBody>
    </>
  );
};

export default SuccessCard;
