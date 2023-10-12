import { deleteUser } from "@/api/user";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

/**
 * Button that when pressed, deletes the logged in user and all its data.
 */
export default function DeleteUserButton() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const confirmCallback = async () => {
    try {
      await deleteUser();
      toast.success("User account deleted. We're sorry to see you go!");
      signOut();
    } catch (e) {
      toast.error("Something went wrong. Please try again.");
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="text-zinc-600 bg-brand-white">
          {(onClose) => (
            <>
              <ModalHeader>Are you sure?</ModalHeader>
              <ModalBody>
                <p>Your account, and all its information will be deleted.</p>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" variant="bordered" onPress={onClose}>
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
      <Button onPress={onOpen} color="danger">
        Delete account
      </Button>
    </>
  );
}
