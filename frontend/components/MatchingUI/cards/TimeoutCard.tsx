import Button from "@/components/Button";
import { ModalHeader, ModalBody } from "@nextui-org/react";
import { useMatchContext } from "../MatchContext";

const TimeoutCard = () => {
  const { onRetry, onClose } = useMatchContext();

  return (
    <>
      <ModalHeader className="flex flex-col gap-1">Timeout</ModalHeader>
      <ModalBody>
        <div className="mb-[80px]">No peers available at the moment</div>
        <Button color="secondary" onClick={onRetry}>
          Try again
        </Button>
        <Button onClick={onClose}>
          Cancel
        </Button>
      </ModalBody>
    </>
  );
};

export default TimeoutCard;
