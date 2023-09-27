import React from "react";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from "@nextui-org/react";
import {
  COLUMNS,
  COLUMN_CONFIGS,
  ColumnKey,
  DEFAULT_PAGE_SIZE_SELECTION,
} from "./config";
import { QuestionBase } from "@/api/questions/types";
import { getQuestions } from "@/api/questions";
import useSWR from "swr";
import { useRouter } from "next/router";
import { getQuestionPath } from "@/routes";
import { QUESTION_API } from "@/api/routes";
import { useQuestionTableContext } from "../QuestionsTableContext";
import TableSelectors from "./TableSelectors";
import TablePagination from "./TablePagination";
import ErrorCard from "@/components/ErrorCard";

const QuestionsTable = () => {
  const {
    filterValue,
    selectedComplexity,
    pageSize,
    page,
    resetQuestionTableOptions,
  } = useQuestionTableContext();
  const router = useRouter();

  const options = {
    size: pageSize ?? DEFAULT_PAGE_SIZE_SELECTION,
    offset: page - 1,
    complexity: selectedComplexity,
    keyword: filterValue,
  };

  const { data, error, isLoading, mutate } = useSWR(
    { QUESTION_API, options },
    () => getQuestions(options),
    { refreshInterval: 1000 },
  );
  const { content: questions } = data ?? {};

  if (error) {
    return (
      <ErrorCard
        isLoading={isLoading}
        onRetry={() => {
          resetQuestionTableOptions();
          mutate({ QUESTION_API, options });
        }}
      />
    );
  }

  return (
    <Table
      aria-label="Questions table"
      topContent={<TableSelectors />}
      topContentPlacement="outside"
      bottomContent={<TablePagination total={data?.total ?? 0} />}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "text-zinc-600",
      }}
      onRowAction={(key) => router.push(getQuestionPath(Number(key)))}
    >
      <TableHeader columns={COLUMNS.map((col) => COLUMN_CONFIGS?.[col])}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === ColumnKey.ACTION ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        emptyContent={"No questions found"}
        items={questions ?? []}
        loadingContent={<Spinner />}
        loadingState={isLoading ? "loading" : "idle"}
      >
        {(question) => (
          <TableRow
            key={question.id}
            className="cursor-pointer hover:bg-gray-200"
          >
            {(columnKey: string | number) => (
              <TableCell key={question.id.toString() + columnKey}>
                {COLUMN_CONFIGS?.[columnKey as ColumnKey]?.render?.(question) ??
                  question?.[columnKey as keyof QuestionBase]}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default QuestionsTable;
