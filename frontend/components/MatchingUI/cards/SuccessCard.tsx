import { ModalBody, ModalHeader } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useMatchContext } from "../MatchContext";
import { useRouter } from "next/router";

const SuccessCard = () => {
  const [secondsLeft, setSecondsLeft] = useState(3);
  const { editorUrl } = useMatchContext();
  const router = useRouter();
  useEffect(() => {
    if (secondsLeft < 1) {
      router.push(editorUrl);
    }
    setTimeout(
      () => setSecondsLeft((currSeconds) => Math.min(0, currSeconds - 0.05)),
      50,
    );
  }, [secondsLeft, editorUrl, router]);

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Success!</ModalHeader>
      <ModalBody>
        <div>{`Redirecting you in ${Math.max(
          0,
          Math.floor(secondsLeft),
        )} second${secondsLeft === 1 ? "" : "s"}...`}</div>
      </ModalBody>
    </>
  );
};

export default SuccessCard;
