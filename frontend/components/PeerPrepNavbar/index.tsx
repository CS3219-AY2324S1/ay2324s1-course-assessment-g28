import useUserInfo from "@/hooks/useUserInfo";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
} from "@nextui-org/react";
import Image from "next/image";
import { signOut } from "next-auth/react";

/**
 * Basic Navbar component.
 */
export default function PeerPrepNavbar() {
  const user = useUserInfo();
  return (
    <Navbar maxWidth="full" className="bg-navbar-color">
      <NavbarBrand>
        <h1 className="font-bold text-xl">PeerPrep</h1>
      </NavbarBrand>
      <NavbarContent justify="end">
        <Dropdown>
          <DropdownTrigger>
            <Button variant="light">
              <Image
                src={user?.image ? user.image : "/user-profile.png"}
                width="36"
                height="36"
                alt="User Thumbnail"
                className="rounded-full"
              />
              {user?.name}
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="User actions">
            <DropdownItem
              onClick={() => signOut()}
              className="text-black"
            >
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
