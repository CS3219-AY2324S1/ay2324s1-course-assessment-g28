import useUserInfo from "@/hooks/useUserInfo";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  NavbarContent,
} from "@nextui-org/react";
import Image from "next/image";
import DefaultProfileImage from "@/assets/images/default-profile-image.png";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { PROFILE } from "@/routes";
import { LogOut, UserCircle } from "lucide-react";

const UserDropdown = () => {
  const { image, name, username } = useUserInfo();
  const router = useRouter();

  return (
    <NavbarContent justify="end">
      <Dropdown>
        <DropdownTrigger>
          <Button variant="light">
            <Image
              src={image ?? DefaultProfileImage}
              width="36"
              height="36"
              alt="User Thumbnail"
              className="rounded-full"
            />
            <div>{username ? username : name}</div>
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="User actions">
          <DropdownItem
            onClick={() => router.push(PROFILE)}
            endContent={<UserCircle size={20} color="purple" />}
          >
            User Profile
          </DropdownItem>
          <DropdownItem
            onClick={() => signOut()}
            endContent={<LogOut size={20} />}
          >
            Logout
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </NavbarContent>
  );
};

export default UserDropdown;
