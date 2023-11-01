import { getOwnUserInfo, updateUser } from "@/api/user";
import useUserInfo from "@/hooks/useUserInfo";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiFillEdit } from "react-icons/ai";
import { mutate } from "swr";

type EditUserButtonProps = {
  favouriteProgrammingLanguage?: string;
};

export default function EditUserButton(props: EditUserButtonProps) {
  const { favouriteProgrammingLanguage } = props;
  const { username = "" } = useUserInfo();
  const [favLangField, setFavLangField] = useState(
    favouriteProgrammingLanguage,
  );
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure({
    onClose: () => setFavLangField(favouriteProgrammingLanguage),
  });

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      await updateUser({
        username,
        favouriteProgrammingLanguage: favLangField,
      });
      await mutate({ getOwnUserInfo });
      setIsLoading(false);
      onClose();
      toast.success("User account updated.");
    } catch (e) {
      toast.error("Something went wrong. Please try again.");
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Update information
              </ModalHeader>
              <ModalBody>
                <form
                  className="flex flex-col mb-[12px]"
                  onChange={(e) => e.preventDefault()}
                >
                  <div className="flex flex-col gap-3 flex-grow mb-[24px]">
                    <span>{"Favourite programming language: "}</span>
                    <Input
                      color="secondary"
                      variant="bordered"
                      placeholder="Favourite Programming Language (optional)"
                      value={favLangField}
                      onChange={(e) => setFavLangField(e.target.value)}
                    />
                  </div>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" variant="bordered" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="secondary"
                  onClick={onSubmit}
                  isDisabled={
                    favLangField === favouriteProgrammingLanguage || isLoading
                  }
                >
                  {isLoading ? <Spinner size="sm" color="white" /> : "Confirm"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Button onPress={onOpen} color="secondary" variant="bordered">
        Update information
        <AiFillEdit />
      </Button>
    </>
  );
}
