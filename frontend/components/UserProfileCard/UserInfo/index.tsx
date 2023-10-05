import useUserInfo from "@/hooks/useUserInfo";
import Image from "next/image";
import DefaultProfileImage from "@/assets/images/default-profile-image.png";
import Card from "@/components/Card";
import DeleteUserButton from "@/components/DeleteUserButton";

const UserInfo = () => {
  const { image, name, username } = useUserInfo();

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
            <div className="font-extrabold text-l">{name}</div>
            <div className="font-extralight  text-xs">@{username}</div>
          </div>
        </div>
        <DeleteUserButton />
      </div>
    </Card>
  );
};

export default UserInfo;
