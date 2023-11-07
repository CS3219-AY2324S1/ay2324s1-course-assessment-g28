import { User } from "@/api/user/types";
import AttemptsTable from "./AttemptsTable";
import { AttemptsTableProvider } from "./AttemptsTableContext";

const PastAttempts = ({ data }: { data: User }) => {
  return (
    <AttemptsTableProvider data={data}>
      <AttemptsTable />
    </AttemptsTableProvider>
  );
};

export default PastAttempts;
