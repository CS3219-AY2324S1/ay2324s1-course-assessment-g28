import { Navbar as NextNavBar } from "@nextui-org/react";
import Brand from "./brand";
import UserDropdown from "./UserDropdown";
import useUserInfo from "@/hooks/useUserInfo";
import ThemeSwitcher from "./ThemeSwitcher";
import cx from "classnames";

export default function Navbar() {
  const { isSignedIn } = useUserInfo();

  return (
    <NextNavBar
      maxWidth="full"
      height={isSignedIn ? "70px" : "60px"}
      classNames={{
        base: cx(
          "bg-gradient-to-b from-purple-700",
          isSignedIn ? "pb-[10px]" : "",
        ),
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
