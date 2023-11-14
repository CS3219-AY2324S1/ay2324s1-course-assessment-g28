import { QuestionBase, QuestionComplexity } from "@/api/questions/types";
import ComplexityChip from "@/components/ComplexityChip";
import DeleteButton from "@/components/QuestionsCard/QuestionsTable/DeleteButton";
import { getUpdateQuestionPath } from "@/routes";
import { Button, Chip } from "@nextui-org/react";
import { CheckCircle, Pencil } from "lucide-react";
import Link from "next/link";

export enum ColumnKey {
  ID = "id",
  TITLE = "title",
  CATEGORY = "category",
  DIFFCULTY = "complexity",
  STATUS = "wasAttempted",
}

export enum ColumnKeyAdminOnly {
  ACTION = "adminAction",
}

export type ColumnKeyAdmin = ColumnKey | ColumnKeyAdminOnly;

interface ColumnConfig {
  name: string;
  uid: ColumnKeyAdmin;
  sortable?: boolean;
  render?: (rowData: QuestionBase) => React.ReactNode;
  align: "start" | "center" | "end";
  width?: number;
}

export const COLUMNS = [
  ColumnKey.STATUS,
  ColumnKey.ID,
  ColumnKey.TITLE,
  ColumnKey.CATEGORY,
  ColumnKey.DIFFCULTY,
];

export const COLUMNS_ADMIN = [...COLUMNS, ColumnKeyAdminOnly.ACTION];

export const COLUMN_CONFIGS: Record<ColumnKey, ColumnConfig> = {
  [ColumnKey.STATUS]: {
    name: "Status",
    uid: ColumnKey.STATUS,
    align: "start",
    width: 10,
    render: (question: QuestionBase) => (
      <div>
        {question.wasAttempted && <CheckCircle color="green" size={20} />}
      </div>
    ),
  },
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
};

/**
 * Columns to display for an admin user. This includes an ACTION column to edit and delete questions.
 */
export const COLUMN_CONFIGS_ADMIN: Record<ColumnKeyAdmin, ColumnConfig> = {
  ...COLUMN_CONFIGS,
  [ColumnKeyAdminOnly.ACTION]: {
    name: "Admin Actions",
    uid: ColumnKeyAdminOnly.ACTION,
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

export const questionFilterRegex = /[^0-9a-z\-_]+/i;
