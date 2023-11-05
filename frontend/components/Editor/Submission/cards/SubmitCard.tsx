import { ModalBody, ModalHeader, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { SubmissionStatus, useSubmissionContext } from "../SubmissionContext";
import { useRouter } from "next/router";
import { HOME } from "@/routes";

const SubmitCard = () => {
  const [secondsLeft, setSecondsLeft] = useState(3);
  const { submissionStatus, setSubmissionStatus, setIsModalOpen } =
    useSubmissionContext();
  const [isSubmitting, setIsSubmitting] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // todo: submission logic
    setTimeout(() => setIsSubmitting(false), 5000);
  }, []);

  useEffect(() => {
    if (isSubmitting) return;
    if (secondsLeft < 1) {
      // TODO: link to next question
      const nextQnUrl = "";
      if (submissionStatus === SubmissionStatus.SUBMIT_BEFORE_EXIT) {
        router.replace(HOME);
      } else {
        router.replace(nextQnUrl);
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
