import { User } from "@/api/user/types";
import AttemptsTable from "./AttemptsTable";
import { AttemptsTableProvider } from "./AttemptsTableContext";
import Card from "@/components/Card";

const PastAttempts = ({ data }: { data: User }) => {
  return (
    <AttemptsTableProvider data={data}>
      <Card className="w-full">
        <AttemptsTable />
      </Card>
    </AttemptsTableProvider>
  );
};

export default PastAttempts;
