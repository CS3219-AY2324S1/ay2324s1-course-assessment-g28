import {
  Input,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { QuestionComplexity } from "@/api/questions/types";
import { ChevronDown, X } from "lucide-react";
import {
  COMPLEXITY_OPTIONS,
  QuestionComplexityConfigsMap,
} from "@/api/questions/constants";
import { useAttemptsTableContext } from "../AttemptsTableContext";
import { questionFilterRegex } from "@/components/QuestionsCard/QuestionsTable/config";

const TableSelectors = () => {
  const {
    filterValue,
    setFilterValue,
    selectedComplexity,
    setSelectedComplexity,
    setPage,
  } = useAttemptsTableContext();

  const onSearchChange = (value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  };

  const onClear = () => {
    setFilterValue("");
    setPage(1);
  };

  return (
    <div className="flex flex-row gap-4 w-full">
      <Input
        isClearable
        size="sm"
        color="secondary"
        variant="bordered"
        className="w-full sm:max-w-[44%] text-foreground-500 text-xs"
        classNames={{
          input: "text-xs",
          inputWrapper:
            "border-[1px] !border-purple-600 hover:!border-purple-500 text-xs",
        }}
        placeholder="Search by question title..."
        value={filterValue}
        onClear={() => onClear()}
        onValueChange={(value) => {
          const regexedVal = value.replace(questionFilterRegex, "");
          onSearchChange(regexedVal);
        }}
      />
      <div className="flex flex-row items-center">
        <Dropdown className="p-0">
          <DropdownTrigger className="hidden sm:flex">
            <Button
              size="sm"
              variant="bordered"
              title="Difficulty"
              className="!border-purple-600
               hover:!border-purple-500 text-xs border-[1px]"
              endContent={<ChevronDown className="w-[12px]" />}
            >
              {selectedComplexity
                ? QuestionComplexityConfigsMap[selectedComplexity].name
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
            className="text-xs"
          >
            {COMPLEXITY_OPTIONS.map((status) => (
              <DropdownItem
                classNames={{ title: "text-xs", description: "text-xs" }}
                key={status.key}
              >
                {status.name}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        {selectedComplexity && (
          <Button
            size="sm"
            isIconOnly
            onClick={() => setSelectedComplexity(undefined)}
            variant="flat"
            title="Reset Difficulty"
            className="ml-[16px]"
          >
            <X color="red" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default TableSelectors;
