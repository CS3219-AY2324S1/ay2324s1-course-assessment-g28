import { Navbar as NextNavBar } from "@nextui-org/react";
import Brand from "./brand";
import UserDropdown from "./UserDropdown";
import useUserInfo from "@/hooks/useUserInfo";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Navbar() {
  const { isSignedIn } = useUserInfo();
  return (
    <NextNavBar
      maxWidth="full"
      height="70px"
      classNames={{
        base: "bg-gradient-to-b from-purple-700 pb-[10px]",
      }}
    >
      <Brand />
      <div className="flex justify-between items-center gap-2">
        <ThemeSwitcher />
        {isSignedIn ? <UserDropdown /> : null}
      </div>
    </NextNavBar>
  );
}
