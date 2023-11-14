import { getOwnUserInfo } from "@/api/user";
import { Spinner } from "@nextui-org/react";
import useSWR from "swr";
import UserInfo from "./UserInfo";
import ErrorCard from "../ErrorCard";

const UserProfileCard = () => {
  const { data, error, isLoading, mutate } = useSWR(
    { getOwnUserInfo },
    getOwnUserInfo,
  );

  if (isLoading) {
    return (
      <div className="h-[500px] w-full flex items-center justify-center">
        <Spinner color="secondary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <ErrorCard
        onRetry={() => {
          mutate({ getOwnUserInfo });
        }}
      />
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full">
      <div className="w-full min-w-[300px] lg:w-[300px] flex-grow">
        <UserInfo data={data} />
      </div>
    </div>
  );
};

export default UserProfileCard;
