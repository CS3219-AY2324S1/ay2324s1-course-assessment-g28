import Card from "@/components/Card";
import QuestionsTable from "./QuestionsTable";

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
