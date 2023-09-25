import { QuestionBase, QuestionComplexity } from "@/api/questions/types";
import { getUpdateQuestionPath } from "@/routes";
import { Chip, Link as NextUILink } from "@nextui-org/react";
import Link from "next/link";

export enum ColumnKey {
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
}

export const COLUMNS = [
  ColumnKey.TITLE,
  ColumnKey.CATEGORY,
  ColumnKey.DIFFCULTY,
  // ColumnKey.ATTEMPTS,
  ColumnKey.ACTION,
];

export const COLUMN_CONFIGS: Record<ColumnKey, ColumnConfig> = {
  [ColumnKey.TITLE]: {
    name: "Title",
    uid: ColumnKey.TITLE,
  },
  [ColumnKey.CATEGORY]: {
    name: "Categories",
    uid: ColumnKey.CATEGORY,
    render: (question: QuestionBase) =>
      question.category.map((cat) => <Chip variant="flat">{cat}</Chip>),
  },
  // [ColumnKey.ATTEMPTS]: {
  //   name: "Attempts",
  //   uid: ColumnKey.ATTEMPTS,
  // },
  [ColumnKey.DIFFCULTY]: {
    name: "Difficulty",
    uid: ColumnKey.DIFFCULTY,
    render: (question: QuestionBase) => {
      switch (question.complexity) {
        case QuestionComplexity.EASY:
          return <span className="text-green-500">Easy</span>;
        case QuestionComplexity.MEDIUM:
          return <span className="text-amber-500">Medium</span>;
        case QuestionComplexity.HARD:
          return <span className="text-red-600">Hard</span>;
      }
    },
  },
  [ColumnKey.ACTION]: {
    name: "ACTIONS",
    uid: ColumnKey.ACTION,
    render: (question: QuestionBase) => (
      <Link href={getUpdateQuestionPath(question.id)} passHref legacyBehavior>
        <NextUILink href={getUpdateQuestionPath(question.id)}>Edit</NextUILink>
      </Link>
    ),
  },
};

export const DEFAULT_COMPLEXITY_SELECTION = QuestionComplexity.EASY;

export const PAGE_SIZE_OPTIONS = [{ name: 10 }, { name: 20 }, { name: 50 }];

export const DEFAULT_PAGE_SIZE_SELECTION = 10;
