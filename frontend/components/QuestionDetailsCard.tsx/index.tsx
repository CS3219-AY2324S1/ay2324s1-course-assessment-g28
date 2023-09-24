import { Question, QuestionComplexity } from "@/api/questions/types";
import { Card, CardHeader, Divider, CardBody } from "@nextui-org/react";
import cx from "classnames";

interface QuestionDetailsProps {
  question: Question;
  className?: string;
}

function getDifficultyText(difficulty: QuestionComplexity) {
  switch (difficulty) {
    case QuestionComplexity.EASY:
      return <h2 className="text-green-500">Easy</h2>;
    case QuestionComplexity.MEDIUM:
      return <h2 className="text-amber-500">Medium</h2>;
    case QuestionComplexity.HARD:
      return <h2 className="text-red-600">Hard</h2>;
  }
}

export default function QuestionDetailsCard({
  question,
  className,
}: QuestionDetailsProps) {
  return (
    <Card fullWidth className={cx(className)}>
      <CardHeader className="flex gap-3">
        <h1>{`${question.id.toString()}. ${question.title}`}</h1>
        <Divider orientation="vertical"/>
        {getDifficultyText(question.complexity)}
      </CardHeader>
      <Divider />
      <CardBody>
        <h2 className="font-bold">Description</h2>
        <p className="whitespace-pre-line pt-2">{question.description}</p>
      </CardBody>
      <Divider />
    </Card>
  );
}
