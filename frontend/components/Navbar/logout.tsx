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

const Logout = () => {
  const { user } = useUserInfo();
  const { image, name } = user ?? {};

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
            <div className="text-white">{name}</div>
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="User actions" className="text-black">
          <DropdownItem onClick={() => signOut()}>Logout</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </NavbarContent>
  );
};

export default Logout;
