import { Modal, ModalContent } from "@nextui-org/react";
import { SubmissionStatus, useSubmissionContext } from "./SubmissionContext";
import SubmissionInitiatedByMeCard from "./cards/SubmissionInitiatedByMeCard";
import SubmissionInitiatedByPeerCard from "./cards/SubmissionInitiatedByPeerCard";
import SubmitCard from "./cards/SubmitCard";
import SubmissionRejectedCard from "./cards/SubmissionRejectedCard";

export const SubmissionModal = () => {
  const { isModalOpen, submissionStatus: submissionStatus } =
    useSubmissionContext();

  const switchContent = () => {
    switch (submissionStatus) {
      case SubmissionStatus.NOT_SUBMITTING:
        return null;

      case SubmissionStatus.EXIT_INIIATED_BY_ME:
      case SubmissionStatus.NEXT_QN_INITIATED_BY_ME:
        return <SubmissionInitiatedByMeCard />;

      case SubmissionStatus.EXIT_INITIATED_BY_PEER:
      case SubmissionStatus.NEXT_QN_INITIATED_BY_PEER:
        return <SubmissionInitiatedByPeerCard />;

      case SubmissionStatus.EXIT_REJECTED:
      case SubmissionStatus.NEXT_QN_REJECTED:
        return <SubmissionRejectedCard />;

      case SubmissionStatus.SUBMIT_BEFORE_EXIT:
      case SubmissionStatus.SUBMIT_BEFORE_NEXT_QN:
        return <SubmitCard />;
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
