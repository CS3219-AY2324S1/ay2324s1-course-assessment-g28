import { QuestionComplexity } from "@/api/questions/types";
import useUserInfo from "@/hooks/useUserInfo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { PairingRequest, PairingRequestZod } from "@/api/pairing/types";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { ChevronDownIcon } from "@/assets/icons/ChevronDown";
import {
  COMPLEXITY_OPTIONS,
  QuestionComplexityToNameMap,
} from "@/api/questions/constants";

const PAIRING_SERVICE = "ws://localhost:4000/pairing";

function create_pairing_request(username: string): string {
  return `${PAIRING_SERVICE}?user=${username}`;
}

export default function PairingForm(
  onSubmit: SubmitHandler<{ complexity: QuestionComplexity }>,
) {
  const user = useUserInfo();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<PairingRequest>({
    resolver: zodResolver(PairingRequestZod),
    defaultValues: {
      complexity: QuestionComplexity.EASY,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-row w-full gap-x-2">
        <label>Difficulty</label>
        <Controller
          name="complexity"
          control={control}
          defaultValue={QuestionComplexity.EASY}
          render={({ field: { onChange, value } }) => (
            <Dropdown className="p-0">
              <DropdownTrigger className="flex">
                <Button
                  endContent={<ChevronDownIcon />}
                  variant="flat"
                  title="Difficulty"
                >
                  {QuestionComplexityToNameMap[value]}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Complexity dropdown"
                selectionMode="single"
                selectedKeys={[value]}
                onAction={(key) => {
                  onChange(key);
                }}
              >
                {COMPLEXITY_OPTIONS.map((status) => (
                  <DropdownItem key={status.key} className="text-zinc-600">
                    {status.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          )}
        />
      </div>
    </form>
  );
}
