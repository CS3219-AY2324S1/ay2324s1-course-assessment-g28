import Card from "@/components/Card";
import QuestionsTable from "./QuestionsTable";

const QuestionsCard = () => {
  return (
    <Card classNames="flex-shrink-0 flex-grow">
      <QuestionsTable />
    </Card>
  );
};

export default QuestionsCard;
