import { ModalHeader, ModalBody, Spinner } from "@nextui-org/react";

const MatchingCard = () => {
  return (
    <>
      <ModalHeader className="flex flex-col gap-1">
        Macthing you with a peer
      </ModalHeader>
      <ModalBody className="h-full">
        <Spinner color="secondary" size="lg" className="p-12" />
        <div>Please wait a moment...</div>
      </ModalBody>
    </>
  );
};

export default MatchingCard;
