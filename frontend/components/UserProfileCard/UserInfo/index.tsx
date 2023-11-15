import useUserInfo from "@/hooks/useUserInfo";
import Image from "next/image";
import DefaultProfileImage from "@/assets/images/default-profile-image.png";
import Card from "@/components/Card";
import DeleteUserButton from "@/components/UserProfileCard/UserInfo/DeleteUserButton";
import { User } from "@/api/user/types";
import { UNDEFINED_VALUE } from "../config";
import EditUserButton from "./EditUserButton";
import { Chip } from "@nextui-org/react";

const UserInfo = ({ data }: { data?: User }) => {
  const { image, name, username } = useUserInfo();
  const { favouriteProgrammingLanguage } = data ?? {};

  return (
    <Card>
      <div className="flex flex-col items-stretch gap-4">
        <div className="flex gap-4 items-center">
          <div
            className="border-violet-800 border-4
            flex flex-shrink-0 w-[60px] h-[60px] rounded-full"
          >
            <Image
              src={image ?? DefaultProfileImage}
              width="60"
              height="60"
              alt="User Thumbnail"
              className="rounded-full "
            />
          </div>
          <div>
            <div className="font-extrabold text-l flex flex-row items-center gap-x-3">
              <span>{name}</span>
              {data?.isAdmin && <Chip color="secondary" size="sm">Admin</Chip>}
            </div>
            <div className="font-extralight  text-xs">@{username}</div>
          </div>
        </div>
        <div className="text-xs">
          {"Favourite programming language: "}
          <span className="font-semibold dark:text-purple-400 text-violet-800">
            {favouriteProgrammingLanguage || UNDEFINED_VALUE}
          </span>
        </div>
        <EditUserButton
          favouriteProgrammingLanguage={favouriteProgrammingLanguage}
        />
        <DeleteUserButton />
      </div>
    </Card>
  );
};

export default UserInfo;
