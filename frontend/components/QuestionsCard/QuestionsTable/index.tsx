import React, { useEffect } from "react";

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
  COLUMNS_ADMIN,
  COLUMN_CONFIGS,
  COLUMN_CONFIGS_ADMIN,
  ColumnKey,
  ColumnKeyAdminOnly,
  DEFAULT_PAGE_SIZE_SELECTION,
} from "./config";
import { QuestionBase } from "@/api/questions/types";
import { getQuestions } from "@/api/questions";
import { useRouter } from "next/router";
import { getQuestionPath } from "@/routes";
import { useQuestionTableContext } from "../QuestionsTableContext";
import TableSelectors from "./TableSelectors";
import TablePagination from "./TablePagination";
import ErrorCard from "@/components/ErrorCard";
import useSWR from "swr";
import { QUESTION_API } from "@/api/routes";

interface QuestionTableProps {
  userIsAdmin: boolean;
}

export default function QuestionTable({ userIsAdmin }: QuestionTableProps) {
  const {
    filterValue,
    selectedComplexity,
    pageSize,
    page,
    setPage,
    resetQuestionTableOptions,
    onlyUnattemptedFilter,
  } = useQuestionTableContext();
  const router = useRouter();

  const options = {
    size: pageSize ?? DEFAULT_PAGE_SIZE_SELECTION,
    offset: page - 1,
    complexity: selectedComplexity,
    keyword: filterValue,
    onlyUnattempted: onlyUnattemptedFilter,
  };

  const { data, error, isLoading, mutate } = useSWR(
    { QUESTION_API, options },
    () => getQuestions(options),
    { refreshInterval: 1000 },
  );
  const { content: questions } = data ?? {};

  useEffect(() => {
    if (!isLoading && page > 1 && (data?.content?.length ?? 0) === 0) {
      setPage((page) => page - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
      topContent={<TableSelectors userIsAdmin={userIsAdmin} />}
      topContentPlacement="outside"
      bottomContent={<TablePagination total={data?.total ?? 0} />}
      bottomContentPlacement="outside"
      onRowAction={(key) => router.push(getQuestionPath(Number(key)))}
    >
      <TableHeader
        columns={
          userIsAdmin
            ? COLUMNS_ADMIN.map((col) => COLUMN_CONFIGS_ADMIN?.[col])
            : COLUMNS.map((col) => COLUMN_CONFIGS?.[col])
        }
      >
        {(column) => (
          <TableColumn
            key={column.uid}
            align={
              column.uid === ColumnKeyAdminOnly.ACTION ? "center" : "start"
            }
            allowsSorting={column.sortable}
            width={column.width}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        className="shadow-large"
        emptyContent={"No questions found"}
        items={questions ?? []}
        loadingContent={<Spinner />}
        loadingState={isLoading ? "loading" : "idle"}
      >
        {(question) => (
          <TableRow
            key={question.id}
            className="cursor-pointer hover:bg-content3 hover:transition-colors"
          >
            {userIsAdmin
              ? (columnKey: string | number) => (
                  <TableCell key={question.id.toString() + columnKey}>
                    {COLUMN_CONFIGS_ADMIN[columnKey as ColumnKey]?.render?.(
                      question,
                    ) ?? question?.[columnKey as keyof QuestionBase]}
                  </TableCell>
                )
              : (columnKey: string | number) => (
                  <TableCell key={question.id.toString() + columnKey}>
                    {COLUMN_CONFIGS[columnKey as ColumnKey]?.render?.(
                      question,
                    ) ?? question?.[columnKey as keyof QuestionBase]}
                  </TableCell>
                )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
