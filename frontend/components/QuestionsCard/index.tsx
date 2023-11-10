import Card from "@/components/Card";
import QuestionsTable from "./QuestionsTable";
import { QuestionTableProvider } from "./QuestionsTableContext";

interface QuestionsCardProps {
  userIsAdmin: boolean;
}

export default function QuestionsCard({ userIsAdmin }: QuestionsCardProps) {
  return (
    <Card className="flex-shrink-0 flex-grow">
        <QuestionsTable userIsAdmin={userIsAdmin} />
    </Card>
  );
}
