import { deleteQuestion } from "@/api/questions";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface DeleteButtonProps {
  questionId: number;
}

export default function DeleteButton({ questionId }: DeleteButtonProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const confirmCallback = async () => {
    setIsLoading(true);
    try {
      await deleteQuestion(questionId);
      onClose();
      toast.success("Question deleted.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
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
      <Button
        size="sm"
        variant="flat"
        color="danger"
        endContent={<Trash2 size="16" />}
        title="Delete Question"
        isLoading={isLoading}
        onPress={onOpen}
      >
        Delete
      </Button>
    </>
  );
}
