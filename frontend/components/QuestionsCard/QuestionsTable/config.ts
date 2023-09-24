import { QuestionComplexityToNameMap } from "@/api/questions/constants";
import { QuestionBase, QuestionComplexity } from "@/api/questions/types";

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
  },
  // [ColumnKey.ATTEMPTS]: {
  //   name: "Attempts",
  //   uid: ColumnKey.ATTEMPTS,
  // },
  [ColumnKey.DIFFCULTY]: {
    name: "Difficulty",
    uid: ColumnKey.DIFFCULTY,
    render: (question: QuestionBase) =>
      QuestionComplexityToNameMap[question.complexity],
  },
  [ColumnKey.ACTION]: {
    name: "ACTIONS",
    uid: ColumnKey.ACTION,
  },
};

export const DEFAULT_COMPLEXITY_SELECTION = QuestionComplexity.EASY;

export const PAGE_SIZE_OPTIONS = [{ name: 10 }, { name: 20 }, { name: 50 }];

export const DEFAULT_PAGE_SIZE_SELECTION = 10;

export const MOCK_DATA: Array<QuestionBase> = [
  {
    id: 0,
    title: "Two Sum",
    category: [],
    complexity: QuestionComplexity.EASY,
  },
  {
    id: 1,
    title: "Two Sum II",
    category: [],
    complexity: QuestionComplexity.MEDIUM,
  },
  {
    id: 2,
    title: "Two Sum III",
    category: [],
    complexity: QuestionComplexity.HARD,
  },
];
