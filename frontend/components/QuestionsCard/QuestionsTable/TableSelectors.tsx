import {
  Input,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { ChevronDownIcon } from "@/assets/icons/ChevronDown";
import { QuestionComplexity } from "@/api/questions/types";
import { PlusSquare, X } from "lucide-react";
import {
  COMPLEXITY_OPTIONS,
  QuestionComplexityConfigsMap,
} from "@/api/questions/constants";
import { useRouter } from "next/router";
import { CREATE_QUESTION } from "@/routes";
import { useQuestionTableContext } from "../QuestionsTableContext";
import { questionFilterRegex } from "@/components/QuestionsCard/QuestionsTable/config";

interface TableSelectorsProps {
  userIsAdmin: boolean;
}

const TableSelectors = ({userIsAdmin}: TableSelectorsProps ) => {
  const {
    filterValue,
    setFilterValue,
    selectedComplexity,
    setSelectedComplexity,
    setPage,
  } = useQuestionTableContext();
  const router = useRouter();

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
        className="w-full sm:max-w-[44%] text-zinc-600"
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
              endContent={<ChevronDownIcon />}
              variant="flat"
              title="Difficulty"
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
      {userIsAdmin && <Button
        className="ml-auto"
        color="secondary"
        variant="flat"
        onPress={() => router.push(CREATE_QUESTION)}
        title="Go to question creation page"
      >
        Create Question <PlusSquare />
      </Button>}
    </div>
  );
};

export default TableSelectors;
