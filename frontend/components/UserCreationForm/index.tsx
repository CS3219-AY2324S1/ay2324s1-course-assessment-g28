import { HttpStatus } from "@/api/constants";
import { RequestError } from "@/api/errors";

import { addUser } from "@/api/user";
import { getUserErrorMessageFromErrorCode } from "@/api/user/constants";
import {
  CreateUserRequestBody,
  CreateUserRequestBodyZod,
} from "@/api/user/types";

import { HOME } from "@/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Input,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function UserCreationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserRequestBody>({
    resolver: zodResolver(CreateUserRequestBodyZod)
  });
  const {update} = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const onSubmit: SubmitHandler<CreateUserRequestBody> = async (data) => {
    setIsLoading(true);
    try {
      await addUser(data);
      toast.success("User Profile Created. Enjoy using PeerPrep!");
      await update();
      router.replace(HOME);
    } catch (e) {
      if (
        e instanceof RequestError &&
        e.response.status === HttpStatus.INTERNAL_SERVER_ERROR 
      ) {
        const errorInfo = await e.response.json();
        toast.error(getUserErrorMessageFromErrorCode(errorInfo.error));
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
      <div className="flex-grow">
        <label>Username</label>
        <Input
          {...register("username")}
          className="text-black"
          errorMessage={errors.username?.message}
        />
      </div>
      <div className="flex-grow">
        <label>Favourite Programming Language (optional)</label>
        <Input
          {...register("favouriteProgrammingLanguage")}
          className="text-black"
          errorMessage={errors.favouriteProgrammingLanguage?.message}
        />
      </div>

      <Button isLoading={isLoading} type="submit" color="secondary">
        Submit
      </Button>
    </form>
  );
}
