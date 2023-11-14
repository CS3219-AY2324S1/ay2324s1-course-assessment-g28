import { Navbar as NextNavBar } from "@nextui-org/react";
import Brand from "./brand";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Navbar() {
  return (
    <NextNavBar
      maxWidth="full"
      height="70px"
      position="static"
      classNames={{
        base: "bg-gradient-to-b from-purple-700 pb-[10px]",
      }}
    >
      <Brand />
      <div className="flex justify-between items-center gap-2">
        <ThemeSwitcher />
      </div>
    </NextNavBar>
  );
}
