import { QuestionBase, QuestionComplexity } from "@/api/questions/types";
import ComplexityChip from "@/components/ComplexityChip";
import DeleteButton from "@/components/QuestionsCard/QuestionsTable/DeleteButton";
import { getUpdateQuestionPath } from "@/routes";
import { Button, Chip } from "@nextui-org/react";
import { Pencil } from "lucide-react";
import Link from "next/link";

export enum ColumnKey {
  ID = "id",
  TITLE = "title",
  CATEGORY = "category",
  DIFFCULTY = "complexity",
  // ATTEMPTS = "attempts",
  ACTION = "action",
}

interface ColumnConfig {
  name: string;
  uid: ColumnKey;
  sortable?: boolean;
  render?: (rowData: QuestionBase) => React.ReactNode;
  align: "start" | "center" | "end";
}

export const COLUMNS = [
  ColumnKey.ID,
  ColumnKey.TITLE,
  ColumnKey.CATEGORY,
  ColumnKey.DIFFCULTY,
  // ColumnKey.ATTEMPTS,
  ColumnKey.ACTION,
];

export const COLUMN_CONFIGS: Record<ColumnKey, ColumnConfig> = {
  [ColumnKey.ID]: {
    name: "ID",
    uid: ColumnKey.ID,
    align: "start",
  },
  [ColumnKey.TITLE]: {
    name: "Title",
    uid: ColumnKey.TITLE,
    align: "start",
  },
  [ColumnKey.CATEGORY]: {
    name: "Categories",
    uid: ColumnKey.CATEGORY,
    render: (question: QuestionBase) => (
      <div className="flex gap-2">
        {question.category.map((cat) => (
          <Chip variant="flat" key={cat}>
            {cat}
          </Chip>
        ))}
      </div>
    ),
    align: "start",
  },
  // [ColumnKey.ATTEMPTS]: {
  //   name: "Attempts",
  //   uid: ColumnKey.ATTEMPTS,
  // },
  [ColumnKey.DIFFCULTY]: {
    name: "Difficulty",
    uid: ColumnKey.DIFFCULTY,
    render: (question: QuestionBase) => (
      <ComplexityChip complexity={question?.complexity} />
    ),
    align: "start",
  },
  [ColumnKey.ACTION]: {
    name: "ACTIONS",
    uid: ColumnKey.ACTION,
    render: (question: QuestionBase) => {
      return (
        <div className="flex flex-row gap-x-2">
          <Link href={getUpdateQuestionPath(question.id)} passHref>
            <Button
              size="sm"
              variant="flat"
              endContent={<Pencil size="16" />}
              title="Edit Question"
            >
              Edit
            </Button>
          </Link>
          <DeleteButton questionId={question.id} />
        </div>
      );
    },
    align: "center",
  },
};

export const DEFAULT_COMPLEXITY_SELECTION = QuestionComplexity.EASY;

export const PAGE_SIZE_OPTIONS = [{ name: 10 }, { name: 20 }, { name: 50 }];

export const DEFAULT_PAGE_SIZE_SELECTION = 10;
