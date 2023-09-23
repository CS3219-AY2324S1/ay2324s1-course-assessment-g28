import React, { useState } from "react";

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
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import {
  COLUMNS,
  COLUMN_CONFIGS,
  ColumnKey,
  DEFAULT_PAGE_SIZE_SELECTION,
  PAGE_SIZE_OPTIONS,
} from "./config";
import { ChevronDownIcon } from "@/assets/icons/ChevronDown";
import { QuestionBase, QuestionComplexity } from "@/api/questions/types";
import { getQuestions } from "@/api/questions";
import { QUESTION_API } from "@/api/routes";
import useSWR from "swr";
import { PlusSquare, X } from "lucide-react";
import {
  COMPLEXITY_OPTIONS,
  QuestionComplexityToNameMap,
} from "@/api/questions/constants";
import { useRouter } from "next/router";
import { CREATE_QUESTION } from "@/routes";

const QuestionsTable = () => {
  const [filterValue, setFilterValue] = useState("");
  const [selectedComplexity, setSelectedComplexity] =
    useState<QuestionComplexity>();
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE_SELECTION);
  const [page, setPage] = useState(1);
  const router = useRouter();

  const options = {
    size: pageSize ?? DEFAULT_PAGE_SIZE_SELECTION,
    offset: page - 1,
    complexity: selectedComplexity,
    keyword: filterValue,
  };

  const { data, error, isLoading } = useSWR({ QUESTION_API, options }, () =>
    getQuestions(options),
  );
  const { content: questions } = data ?? {};

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
      <div className="flex flex-row gap-4 w-full">
        <Input
          isClearable
          className="w-full sm:max-w-[44%] text-zinc-600"
          placeholder="Search by question title..."
          // startContent={<SearchIcon />}
          value={filterValue}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />
        <div className="flex flex-row items-center">
          <Dropdown className="p-0">
            <DropdownTrigger className="hidden sm:flex">
              <Button
                endContent={<ChevronDownIcon />}
                variant="flat"
                title="Difficulty"
              >
                {selectedComplexity
                  ? QuestionComplexityToNameMap[selectedComplexity]
                  : "Select Difficulty"}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Complexity dropdown"
              selectionMode="single"
              selectedKeys={selectedComplexity ? [selectedComplexity] : []}
              onAction={(key) => {
                setSelectedComplexity(key as QuestionComplexity);
              }}
            >
              {COMPLEXITY_OPTIONS.map((status) => (
                <DropdownItem key={status.key} className="text-zinc-600">
                  {status.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          {selectedComplexity && (
            <Button
              isIconOnly
              onClick={() => setSelectedComplexity(undefined)}
              variant="flat"
              title="Reset Difficulty"
            >
              <X color="red" />
            </Button>
          )}
          
        </div>
        <Button
        className="ml-auto"
          color="secondary"
          variant="flat"
            onPress={() => router.push(CREATE_QUESTION)}
            title="Go to question creation page"
          >
            Create Question <PlusSquare />
          </Button>
      </div>
    );
  }, [filterValue, selectedComplexity, onSearchChange, onClear, router]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex items-center justify-between">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          // todo: add total to api response
          total={10}
          onChange={setPage}
        />
        <Dropdown>
          <DropdownTrigger className="sm:flex">
            <Button endContent={<ChevronDownIcon />} variant="flat">
              {`${pageSize.toString()} / Page`}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Question number dropdown"
            selectionMode="single"
            selectedKeys={[pageSize]}
            onAction={(key) => setPageSize(key as number)}
          >
            {PAGE_SIZE_OPTIONS.map((pageSizeOption) => (
              <DropdownItem key={pageSizeOption.name} className="text-zinc-600">
                {pageSizeOption.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }, [page, pageSize]);

  return (
    <Table
      aria-label="Questions table"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "text-zinc-600",
      }}
      topContent={topContent}
      topContentPlacement="outside"
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
      <TableBody emptyContent={"No questions found"} items={questions ?? []}>
        {(question) => (
          <TableRow key={question.title}>
            {(columnKey: string | number) => (
              <TableCell>
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
