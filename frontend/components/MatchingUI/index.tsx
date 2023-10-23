import { MatchContextProvider } from "./MatchContext";
import { MatchModal, MatchModalProps } from "./MatchModal";

const MatchingUI = (props: MatchModalProps) => (
  <MatchContextProvider>
    <MatchModal {...props} />
  </MatchContextProvider>
);

export default MatchingUI;
