import { QuestionBase, QuestionComplexity } from "@/api/questions/types";

export enum ColumnKey {
  TITLE = "title",
  CATEGORY = "category",
  // ATTEMPTS = "attempts",
  ACTION = "action"
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
  [ColumnKey.ACTION]: {
    name: "ACTIONS",
    uid: ColumnKey.ACTION,
  },
};

export const COMPLEXITY_OPTIONS = [
  { name: "Easy", uid: QuestionComplexity.EASY },
  { name: "Medium", uid: QuestionComplexity.MEDIUM },
  { name: "Hard", uid: QuestionComplexity.HARD },
];

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

export const QuestionComplexityOptions = [
  QuestionComplexity.EASY,
  QuestionComplexity.MEDIUM,
  QuestionComplexity.HARD,
];
