import { QuestionComplexity, QuestionType } from "@/api/questions";

export enum ColumnKey {
  TITLE = "title",
  CATEGORY = "category",
  ATTEMPTS = "attempts",
  ACTION = "action"
}

interface ColumnConfig {
  name: string;
  uid: ColumnKey;
  sortable?: boolean;
  render?: (rowData: QuestionType) => React.ReactNode;
}

export const COLUMNS = [
  ColumnKey.TITLE,
  ColumnKey.CATEGORY,
  ColumnKey.ATTEMPTS,
  ColumnKey.ACTION,
];

export const COLUMN_CONFIGS:Record<ColumnKey, ColumnConfig> = {
  [ColumnKey.TITLE]: {
    name: "Title",
    uid: ColumnKey.TITLE,
    sortable: true,
  },
  [ColumnKey.CATEGORY]: {
    name: "Categories",
    uid: ColumnKey.CATEGORY,
  },
  [ColumnKey.ATTEMPTS]: {
    name: "Attempts",
    uid: ColumnKey.ATTEMPTS,
    sortable: true,
  },
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

export const MOCK_DATA: Array<QuestionType> = [
  {
    title: "Two Sum",
    description: "Description 1",
    category: [],
    attempts: 2000,
    complexity: QuestionComplexity.EASY,
  },
  {
    title: "Two Sum II",
    description: "Description 2",
    category: [],
    attempts: 2000,
    complexity: QuestionComplexity.MEDIUM,
  },
  {
    title: "Two Sum III",
    description: "Description 3",
    category: [],
    attempts: 2000,
    complexity: QuestionComplexity.HARD,
  },
];
