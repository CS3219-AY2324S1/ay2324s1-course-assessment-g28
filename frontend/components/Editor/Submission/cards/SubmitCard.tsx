import { ModalBody, ModalHeader, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { SubmissionStatus, useSubmissionContext } from "../SubmissionContext";
import { useRouter } from "next/router";
import { HOME } from "@/routes";

// TODO: Pass question from collab editor to this card. use question details to make submission attempt

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
  } = useSubmissionContext();
  const [isSubmitting, setIsSubmitting] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // todo: submission logic
    (async () => {
      /*
       await createQuestionAttempt({
        questionId: question.id,
        questionTitle: question.title,
        questionDifficulty: question.complexity,
        attemptDate: new Date().toISOString(),
        attemptDetails: editorContent,
        attemptLanguage: language,
      });
       */

      setIsSubmitting(false);
    })();
  }, []);

  useEffect(() => {
    if (nextQuestionPath !== "") {
      router
        .push(nextQuestionPath, undefined, { shallow: false })
        .then((res) => setTimeout(() => router.reload(), 3000));
    }
  }, [nextQuestionPath]);

  useEffect(() => {
    if (isSubmitting) return;
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
    isSubmitting,
    secondsLeft,
    router,
    submissionStatus,
    setSubmissionStatus,
    setIsModalOpen,
  ]);

  return isSubmitting ? (
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
