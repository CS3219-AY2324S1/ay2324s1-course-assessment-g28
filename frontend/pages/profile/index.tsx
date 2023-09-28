import { getOwnUserInfo } from "@/api/user";
import DeleteUserButton from "@/components/DeleteUserButton";
import { Spinner } from "@nextui-org/react";
import useSWR from "swr";

export default function ProfilePage() {
  const { data, error, isLoading } = useSWR({ getOwnUserInfo }, getOwnUserInfo);

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <div>{JSON.stringify(data)}</div>
      <DeleteUserButton />
    </div>
  );
}
