import { Question } from "@/api/questions/types";
import Card from "@/components/Card";
import ComplexityChip from "@/components/ComplexityChip";

interface QuestionDetailsProps {
  question: Question;
  className?: string;
}

export default function QuestionDetailsCard({
  question,
  className,
}: QuestionDetailsProps) {
  const { id, title, complexity, description } = question ?? {};
  return (
    <Card className={className}>
      <div className="flex gap-3 items-center justify-between mb-2">
        <h1 className="font-medium text-[24px] truncate">
          {`${id.toString()}. ${title}`}
        </h1>
        <ComplexityChip complexity={complexity} />
      </div>
      <div>
        <p className="whitespace-pre-line font-light">{description}</p>
      </div>
    </Card>
  );
}
