import React from "react";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Pagination,
  Selection,
  SortDescriptor,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import {
  COLUMNS,
  COLUMN_CONFIGS,
  COMPLEXITY_OPTIONS,
  ColumnKey,
  MOCK_DATA,
} from "./config";
import { QuestionComplexityOptions, QuestionType } from "@/api/questions";
import { ChevronDownIcon } from "@/assets/icons/ChevronDown";

const QuestionsTable = () => {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([]),
  );
  const [complexityFilter, setComplexityFilter] =
    React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: ColumnKey.TITLE,
    direction: "ascending",
  });

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = React.useMemo(() => {
    let filteredQuestions = [...MOCK_DATA];
    const isAllDifficultiesSelected =
      complexityFilter == "all" ||
      Array.from(complexityFilter).length == QuestionComplexityOptions.length;
    if (hasSearchFilter) {
      filteredQuestions = filteredQuestions.filter(
        (question) =>
          question?.title?.toLowerCase()?.includes(filterValue.toLowerCase()),
      );
    }
    if (!isAllDifficultiesSelected) {
      filteredQuestions = filteredQuestions.filter((question) =>
        Array.from(complexityFilter).includes(question.complexity),
      );
    }
    return filteredQuestions;
  }, [filterValue, complexityFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedQuestions = React.useMemo(() => {
    return [...items].sort((a: QuestionType, b: QuestionType) => {
      const first = a[sortDescriptor.column as keyof QuestionType] as number;
      const second = b[sortDescriptor.column as keyof QuestionType] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%] text-zinc-600"
            placeholder="Search by name..."
            // startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
        </div>
        <Dropdown>
          <DropdownTrigger className="hidden sm:flex">
            <Button endContent={<ChevronDownIcon />} variant="flat">
              Status
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Table Columns"
            closeOnSelect={false}
            selectedKeys={complexityFilter}
            selectionMode="multiple"
            onSelectionChange={setComplexityFilter}
          >
            {COMPLEXITY_OPTIONS.map((status) => (
              <DropdownItem key={status.uid} className="text-zinc-600">
                {status.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <div className="flex justify-between items-center">
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    complexityFilter,
    onSearchChange,
    onRowsPerPageChange,
    MOCK_DATA.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <Table
      aria-label="Questions table"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "bg-[#D9D9D9] text-zinc-600",
      }}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSortChange={setSortDescriptor}
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
      <TableBody emptyContent={"No questions found"} items={sortedQuestions}>
        {(question) => (
          <TableRow key={question.title}>
            {(columnKey: string | number) => (
              <TableCell>
                {COLUMN_CONFIGS?.[columnKey as ColumnKey]?.render?.(question) ??
                  question?.[columnKey as keyof QuestionType]}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default QuestionsTable;
