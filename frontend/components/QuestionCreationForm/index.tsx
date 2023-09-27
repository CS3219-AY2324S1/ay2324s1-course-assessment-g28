import { HttpStatus } from "@/api/constants";
import { RequestError } from "@/api/errors";
import { patchQuestion, postQuestion } from "@/api/questions";
import {
  COMPLEXITY_OPTIONS,
  QuestionComplexityConfigsMap,
  getErrorMessageFromErrorCode,
} from "@/api/questions/constants";
import {
  Question,
  QuestionComplexity,
  QuestionCreation,
  QuestionCreationZod,
} from "@/api/questions/types";
import { ChevronDownIcon } from "@/assets/icons/ChevronDown";
import CategoryAdder from "@/components/QuestionCreationForm/CategoryAdder";
import { HOME } from "@/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Textarea,
} from "@nextui-org/react";
import router from "next/router";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface QuestionCreationFormProps {
  originalQuestion?: Question; // data from an already existing question
}

export default function QuestionCreationForm({
  originalQuestion,
}: QuestionCreationFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<QuestionCreation>({
    resolver: zodResolver(QuestionCreationZod),
    defaultValues: {
      complexity: QuestionComplexity.EASY,
    },
    values: originalQuestion,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const onSubmit: SubmitHandler<QuestionCreation> = async (data) => {
    setIsLoading(true);
    try {
      if (typeof originalQuestion !== "undefined") {
        // this is to update the original question
        await patchQuestion(originalQuestion?.id, data);
        toast.success("Question successfully updated.");
      } else {
        // this is to create a new question
        await postQuestion(data);
        toast.success("Question successfully added.");
      }
    } catch (e) {
      if (
        !originalQuestion &&
        e instanceof RequestError &&
        e.response.status === HttpStatus.INTERNAL_SERVER_ERROR
      ) {
        const errorInfo = await e.response.json();
        toast.error(getErrorMessageFromErrorCode(errorInfo.error));
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full flex flex-col gap-y-2"
    >
      <div className="flex flex-row w-full gap-x-2">
        <div className="flex-grow">
          <label>Title</label>
          <Input
            {...register("title")}
            className="text-black"
            errorMessage={errors.title?.message}
            onValueChange={() => setIsEdited(true)}
          />
        </div>
        <div>
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
                    {QuestionComplexityConfigsMap[value].name}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Complexity dropdown"
                  selectionMode="single"
                  selectedKeys={[value]}
                  onAction={(key) => {
                    onChange(key);
                    setIsEdited(true);
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
      </div>

      <div>
        <label>Description</label>
        <Textarea
          classNames={{
            base: "text-black ",
            label: "hidden",
          }}
          {...register("description")}
          placeholder="Enter question description"
          errorMessage={errors.description?.message}
          onValueChange={() => setIsEdited(true)}
        ></Textarea>
      </div>

      <div>
        <label>Categories</label>
        <Controller
          name="category"
          control={control}
          defaultValue={[]}
          render={({ field: { onChange, value } }) => (
            <CategoryAdder
              categories={value}
              onChange={(cats) => {
                onChange(cats);
                setIsEdited(true);
              }}
            ></CategoryAdder>
          )}
        />
      </div>

      {(!originalQuestion || isEdited) && (
        <Button isLoading={isLoading} type="submit" color="secondary">
          {originalQuestion ? "Save changes" : "Submit"}
        </Button>
      )}
      <Button
        color="danger"
        variant="flat"
        onPress={() => router.push(HOME)}
        title="Go to question creation page"
      >
        Cancel
      </Button>
    </form>
  );
}
