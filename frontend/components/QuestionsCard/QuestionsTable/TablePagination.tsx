import {
  Pagination,
  Dropdown,
  DropdownTrigger,
  Button,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { ChevronDownIcon } from "lucide-react";
import { PAGE_SIZE_OPTIONS } from "./config";
import { useQuestionTableContext } from "../QuestionsTableContext";

const TablePagination = ({ total }: { total: number }) => {
  const { page, pageSize, setPageSize, setPage } = useQuestionTableContext();

  return (
    <div className="py-2 px-2 flex items-center justify-between">
      <Pagination
        isCompact
        showControls
        showShadow
        color="secondary"
        page={page}
        total={Math.ceil(total / pageSize)}
        onChange={setPage}
        disableAnimation
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
            <DropdownItem
              key={pageSizeOption.name}
              className="text-zinc-600 text-center"
            >
              {`${pageSizeOption.name.toString()} questions / Page`}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default TablePagination;
