import { ModalBody, ModalHeader, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { SubmissionStatus, useSubmissionContext } from "../SubmissionContext";
import { useRouter } from "next/router";
import { HOME } from "@/routes";

/**
 * This card is only shown when submission status is:
 *  - SUBMIT_BEFORE_EXIT OR
 *  - SUBMIT_BEFORE_NEXT_QN
 */
const SubmitCard = () => {
  const [secondsLeft, setSecondsLeft] = useState(3);
  const {
    submissionStatus,
    setSubmissionStatus,
    setIsModalOpen,
    nextQuestionPath,
    isSubmitted: isSubmissionInProgress,
  } = useSubmissionContext();
  const router = useRouter();

  useEffect(() => {
    if (nextQuestionPath !== "") {
      router
        .push(nextQuestionPath, undefined, { shallow: false })
        .then((res) => setTimeout(() => router.reload(), 3000));
    }
  }, [nextQuestionPath]);

  useEffect(() => {
    if (secondsLeft < 1) {
      console.log("Next qn url:", nextQuestionPath);

      if (submissionStatus === SubmissionStatus.SUBMIT_BEFORE_EXIT) {
        router.push(HOME);
      }

      return () => {
        setSubmissionStatus(SubmissionStatus.NOT_SUBMITTING);
        setIsModalOpen(false);
      };
    } else {
      setTimeout(
        () => setSecondsLeft((currSeconds) => Math.max(0, currSeconds - 0.05)),
        50,
      );
    }
  }, [
    secondsLeft,
    router,
    submissionStatus,
    setSubmissionStatus,
    setIsModalOpen,
  ]);

  return isSubmissionInProgress ? (
    <>
      <ModalHeader className="flex flex-col gap-1">
        Submitting your attempt
      </ModalHeader>
      <ModalBody>
        <div>{"Please wait a moment"}</div>
        <Spinner color="secondary" />
      </ModalBody>
    </>
  ) : (
    <>
      <ModalHeader className="flex flex-col gap-1">
        Submission received!
      </ModalHeader>
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

export default SubmitCard;
