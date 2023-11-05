import { Question } from "@/api/questions/types";
import { createQuestionAttempt } from "@/api/user";
import { HOME } from "@/routes";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";

export type EditorSubmissionState =
  | "unattempted"
  | "confirmation"
  | "loading"
  | "success"
  | "error";

export interface EditorSubmissionModalButtonProps {
  question: Question;
  editorContent: string;
}

export default function EditorSubmissionModalButton({
  question,
  editorContent,
}: EditorSubmissionModalButtonProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const [submissionState, setSubmissionState] =
    useState<EditorSubmissionState>("unattempted");
  const handleSubmission = useCallback(async () => {
    setSubmissionState("loading");
    try {
      await createQuestionAttempt({
        questionId: question.id,
        questionTitle: question.title,
        questionDifficulty: question.complexity,
        attemptDate: new Date().toISOString(),
        attemptDetails: editorContent,
      });
      toast.success("Question attempt successfully submitted!");
      setSubmissionState("success");
    } catch (e) {
      toast.error("Something went wrong. Please try again.");
      setSubmissionState("error");
    }
  }, [editorContent, question.complexity, question.id, question.title]);

  let modal = null;
  if (submissionState === "confirmation") {
    modal = (
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Submission
              </ModalHeader>
              <ModalBody>
                Are you sure you{"'"}re ready to submit? This will save the code
                you have written under a new attempt for this question.
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose}>Cancel</Button>
                <Button color="secondary" onPress={handleSubmission}>
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  } else if (submissionState === "loading") {
    modal = (
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Submission
              </ModalHeader>
              <ModalBody className="grid content-center">
                <Spinner></Spinner>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  } else if (submissionState === "success") {
    modal = (
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Submission Success!
              </ModalHeader>
              <ModalBody>
                You{"'"}re attempt has been successfully submitted.
              </ModalBody>
              <ModalFooter>
                <Button
                  onPress={() => {
                    setSubmissionState("unattempted");
                    onClose();
                  }}
                >
                  Continue Editing
                </Button>
                <Button color="secondary" onPress={() => router.push(HOME)}>
                  Return to Homepage
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  } else if (submissionState === "error") {
    modal = (
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Submission Failed
              </ModalHeader>
              <ModalBody>
                Something went wrong submitting your code. Please try again.
              </ModalBody>
              <ModalFooter>
                <Button
                  onPress={() => {
                    setSubmissionState("unattempted");
                    onClose();
                  }}
                >
                  Cancel
                </Button>
                <Button color="secondary" onPress={handleSubmission}>
                  Retry
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  }

  return (
    <>
      <Button
        color="secondary"
        onPress={() => {
          setSubmissionState("confirmation");
          onOpen();
        }}
      >
        Submit
      </Button>
      {modal}
    </>
  );
}
