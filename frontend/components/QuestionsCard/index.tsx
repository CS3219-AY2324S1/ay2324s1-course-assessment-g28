import Card from "@/components/Card";
import QuestionsTable from "./QuestionsTable";


export default function QuestionsCard() {
  return (
    <Card className="flex-shrink-0 flex-grow">
      <QuestionsTable/>
    </Card>
  );
}
