import { Navbar as NextNavBar } from "@nextui-org/react";
import Brand from "./brand";
import Logout from "./logout";
import useUserInfo from "@/hooks/useUserInfo";

export default function Navbar() {
  const { isSignedIn } = useUserInfo();
  return (
    <NextNavBar
      maxWidth="full"
      height="60px"
      className="bg-white bg-opacity-10"
    >
      <Brand />
      {isSignedIn ? <Logout /> : null}
    </NextNavBar>
  );
}
