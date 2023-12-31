import { ModalBody, ModalHeader, Spinner } from "@nextui-org/react";
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
      () => setSecondsLeft((currSeconds) => Math.max(0, currSeconds - 0.05)),
      50,
    );
  }, [secondsLeft, editorUrl, router]);

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Success!</ModalHeader>
      <ModalBody>
        {secondsLeft > 0 ? (
          <div>{`Redirecting you in ${Math.floor(secondsLeft)} second${
            secondsLeft === 1 ? "" : "s"
          }...`}</div>
        ) : (
          <>
            <div>Redirecting</div>
            <Spinner color="secondary" />
          </>
        )}
      </ModalBody>
    </>
  );
};

export default SuccessCard;
