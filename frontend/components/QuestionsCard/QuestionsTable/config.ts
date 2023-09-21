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

export const QuestionComplexityToNameMap: Record<QuestionComplexity, string> = {
  [QuestionComplexity.EASY]: "Easy",
  [QuestionComplexity.MEDIUM]: "Medium",
  [QuestionComplexity.HARD]: "Hard",
}

export const COMPLEXITY_OPTIONS = Object.keys(QuestionComplexityToNameMap).map(
  (key) => ({
    key,
    name: QuestionComplexityToNameMap[parseInt(key) as QuestionComplexity],
  }));

export const DEFAULT_COMPLEXITY_SELECTION = QuestionComplexity.EASY;

export const PAGE_SIZE_OPTIONS = [
  { name: 10 },
  { name: 20 },
  { name: 50 },
];

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
