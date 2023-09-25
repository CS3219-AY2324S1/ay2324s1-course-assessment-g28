import Card from "@/components/Card";
import QuestionsTable from "./QuestionsTable";
import { QuestionTableProvider } from "./QuestionsTableContext";

const QuestionsCard = () => {
  return (
    <Card classNames="flex-shrink-0 flex-grow">
      <QuestionTableProvider>
        <QuestionsTable />
      </QuestionTableProvider>
    </Card>
  );
};

export default QuestionsCard;
