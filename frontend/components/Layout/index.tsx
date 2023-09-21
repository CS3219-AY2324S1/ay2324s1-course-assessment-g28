import { CSSProperties, PropsWithChildren } from "react";
import cx from "classnames";
import { POPPINS_CLASS } from "@/assets/fonts/poppins";
import Navbar from "@/components/Navbar";
import BackgroundImage from "@/assets/images/background-image.png";
import useUserInfo from "@/hooks/useUserInfo";

const { src: backgroundImageSrc } = BackgroundImage;
const backgroundWithImageStyle: CSSProperties = {
  backgroundImage: `url(${backgroundImageSrc})`,
  backgroundSize: "cover",
};

const Layout = ({ children }: PropsWithChildren<unknown>) => {
  const { isNotSignedIn } = useUserInfo();
  return (
    <div
      className="w-screen h-screen overflow-hidden bg-neutral-700
        transition-all duration-300"
      style={isNotSignedIn ? backgroundWithImageStyle : {}}
    >
      <Navbar />
      <main
        className={cx(
          "flex min-h-screen flex-col items-center p-8",
          POPPINS_CLASS,
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
