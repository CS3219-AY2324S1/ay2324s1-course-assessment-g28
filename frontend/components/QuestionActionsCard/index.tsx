import { deleteQuestion } from "@/api/questions";
import { Question } from "@/api/questions/types";
import QuestionAttemptButton from "@/components/QuestionAttemptButton";
import useUserInfo from "@/hooks/useUserInfo";
import { HOME, getUpdateQuestionPath } from "@/routes";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  cn,
  useDisclosure,
} from "@nextui-org/react";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";

interface QuestionActionsCardProps {
  question: Question;
  className?: string;
}

export default function QuestionActionsCard({
  question,
  className,
}: QuestionActionsCardProps) {
  const { isAdmin } = useUserInfo();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const confirmCallback = useCallback(async () => {
    setIsLoading(true);
    try {
      await deleteQuestion(question.id);
      onClose();
      toast.success("Question deleted.");
      router.push(HOME);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [onClose, router, question]);

  const editQuestionCallback = useCallback(() => {
    router.push(getUpdateQuestionPath(question.id));
  }, [router, question]);

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Are you sure?
              </ModalHeader>
              <ModalBody>
                <p>This question will be deleted.</p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="secondary" onPress={confirmCallback}>
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div
        className={cn(
          "flex flex-row gap-2 flex-wrap items-center justify-end py-2",
          className,
        )}
      >
        {isAdmin && (
          <div className="flex flex-row gap-2">
            <Button
              title="Navigate to edit question page"
              onPress={editQuestionCallback}
              endContent={<Pencil size="18" />}
              className="text-foreground"
            >
              Edit
            </Button>
            <Button
              color="danger"
              endContent={<Trash2 size="18" />}
              title="Delete Question"
              isLoading={isLoading}
              onPress={onOpen}
            >
              Delete
            </Button>
          </div>
        )}

        <div className="flex flex-row gap-2">
          <QuestionAttemptButton question={question} />
        </div>
      </div>
    </>
  );
}
