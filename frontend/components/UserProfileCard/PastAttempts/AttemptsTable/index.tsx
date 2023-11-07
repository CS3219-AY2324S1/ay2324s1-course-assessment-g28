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
import { COLUMNS, COLUMN_CONFIGS, ColumnKey, customClassNames } from "./config";
import { useRouter } from "next/router";
import { getQuestionAttemptPath } from "@/routes";
import {
  ProcessedAttemptType,
  useAttemptsTableContext,
} from "../AttemptsTableContext";
import TableSelectors from "./TableSelectors";
import TablePagination from "./TablePagination";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);

export default function AttemptsTable() {
  const { attempts, sortDescriptor, setSortDescriptor } =
    useAttemptsTableContext();
  const router = useRouter();

  return (
    <Table
      aria-label="Attempts table"
      sortDescriptor={sortDescriptor}
      onSortChange={setSortDescriptor}
      topContent={<TableSelectors />}
      topContentPlacement="outside"
      bottomContent={<TablePagination />}
      bottomContentPlacement="outside"
      onRowAction={(key) => router.push(getQuestionAttemptPath(Number(key)))}
      classNames={customClassNames}
    >
      <TableHeader columns={COLUMNS.map((col) => COLUMN_CONFIGS?.[col])}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.align}
            allowsSorting={column.sortable}
            width={column.width}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        className="shadow-large"
        emptyContent={"No attempts found"}
        items={attempts ?? []}
        loadingContent={<Spinner />}
      >
        {(attempt: ProcessedAttemptType) => (
          <TableRow
            key={attempt?.attemptId}
            className="cursor-pointer hover:bg-content3 hover:transition-colors"
          >
            {(columnKey: string | number) => (
              <TableCell key={attempt?.attemptId?.toString() + columnKey}>
                {COLUMN_CONFIGS[columnKey as ColumnKey]?.render?.(attempt) ??
                  attempt?.[columnKey as ColumnKey]}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
