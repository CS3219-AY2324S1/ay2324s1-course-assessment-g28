import { Modal, ModalContent } from "@nextui-org/react";
import { SubmissionStatus, useSubmissionContext } from "./SubmissionContext";
import ExitInitiatedByMeCard from "./cards/ExitInitiatedByMeCard";
import ExitInitiatedByPeerCard from "./cards/ExitInitiatedByPeerCard";
import SubmitCard from "./cards/SubmitCard";
import ExitRejected from "./cards/ExitRejectedCard";

export const SubmissionModal = () => {
  const { isModalOpen, submissionStatus: submissionStatus } =
    useSubmissionContext();

  const switchContent = () => {
    switch (submissionStatus) {
      case SubmissionStatus.NOT_SUBMITTING:
        return null;

      case SubmissionStatus.EXIT_INIIATED_BY_ME:
        return <ExitInitiatedByMeCard />;
      case SubmissionStatus.EXIT_INITIATED_BY_PEER:
        return <ExitInitiatedByPeerCard />;
      case SubmissionStatus.EXIT_REJECTED:
        return <ExitRejected />;
      case SubmissionStatus.NEXT_QN_INITIATED_BY_ME:
        return; // TODO
      case SubmissionStatus.NEXT_QN_INITIATED_BY_PEER:
        return; // TODO
      case SubmissionStatus.NEXT_QN_REJECTED:
        return; // TODO

      case SubmissionStatus.SUBMIT_BEFORE_EXIT:
        return <SubmitCard />;
      case SubmissionStatus.SUBMIT_BEFORE_NEXT_QN:
    }
  };

  return (
    <Modal
      hideCloseButton
      isOpen={isModalOpen}
      className="text-brand-white bg-gradient-to-br h-[300px]
        from-violet-500 to-fuchsia-500 flex flex-col items-center"
    >
      <ModalContent className="p-4">{switchContent()}</ModalContent>
    </Modal>
  );
};
