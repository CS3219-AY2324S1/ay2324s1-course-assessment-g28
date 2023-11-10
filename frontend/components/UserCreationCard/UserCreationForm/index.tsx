import { HttpStatus } from "@/api/constants";
import { RequestError } from "@/api/errors";

import { addUser } from "@/api/user";
import { getUserErrorMessageFromErrorCode } from "@/api/user/constants";
import {
  CreateUserRequestBody,
  CreateUserRequestBodyZod,
} from "@/api/user/types";
import useDebounce from "@/hooks/useDebounce";

import { HOME } from "@/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useIsUsernameValid, { UsernameStatus } from "../useIsUsernameValid";
import { AiFillCheckCircle } from "react-icons/ai";
import { RxCrossCircled } from "react-icons/rx";

const USERNAME_CHECK_DEBOUNCE = 500;

export default function UserCreationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserRequestBody>({
    resolver: zodResolver(CreateUserRequestBodyZod),
  });
  const { update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const debouncedUsernameValue = useDebounce(username, USERNAME_CHECK_DEBOUNCE);
  const { usernameStatus, Tip } = useIsUsernameValid(debouncedUsernameValue);

  const onSubmit: SubmitHandler<CreateUserRequestBody> = async (data) => {
    setIsLoading(true);
    try {
      await addUser(data);
      toast.success("User Profile Created. Enjoy using PeerPrep!");
      await update();
      router.replace(HOME);
    } catch (e) {
      const isServerError =
        e instanceof RequestError &&
        e.response.status === HttpStatus.INTERNAL_SERVER_ERROR;
      if (isServerError) {
        const errorInfo = await e.response.json();
        toast.error(getUserErrorMessageFromErrorCode(errorInfo.errorCode));
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = async (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    const username = e?.currentTarget?.value;
    setUsername(username);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col text-zinc-600 mb-[12px]"
      onChange={(e) => e.preventDefault()}
    >
      <div className="flex-grow flex flex-col items-start">
        <Input
          {...register("username")}
          onChange={onChange}
          className="text-zinc-600"
          color="secondary"
          endContent={
            usernameStatus === UsernameStatus.AVAILABLE ? (
              <AiFillCheckCircle className="fill-green-600" />
            ) : (
              <RxCrossCircled className="text-rose-600" />
            )
          }
          placeholder="Username"
        />
        <div className="pl-2">{Tip}</div>
      </div>
      <div className="flex-grow mb-[24px]">
        <Input
          {...register("favouriteProgrammingLanguage")}
          className="text-zinc-600"
          color="secondary"
          errorMessage={errors.favouriteProgrammingLanguage?.message}
          placeholder="Favourite Programming Language (optional)"
        />
      </div>
      <div className="flex gap-2 w-full justify-end">
        <Button
          className="hover:bg-purple-200 hover:transition-colors w-12"
          variant="bordered"
          color="secondary"
          radius="full"
          onClick={() => signOut()}
        >
          Cancel
        </Button>
        <Button
          isLoading={isLoading || usernameStatus === UsernameStatus.LOADING}
          isDisabled={usernameStatus !== UsernameStatus.AVAILABLE}
          className="hover:bg-purple-400 hover:transition-colors w-12"
          type="submit"
          color="secondary"
          radius="full"
        >
          {isLoading || usernameStatus === UsernameStatus.LOADING
            ? ""
            : "Submit"}
        </Button>
      </div>
    </form>
  );
}
