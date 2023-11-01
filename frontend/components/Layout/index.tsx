import { useTheme } from "next-themes";
import { CSSProperties, PropsWithChildren } from "react";
import cx from "classnames";
import { POPPINS_CLASS } from "@/assets/fonts/poppins";
import Navbar from "@/components/Navbar";
import BackgroundImage from "@/assets/images/background-image.png";
import { usePathname } from "next/navigation";

const { src: backgroundImageSrc } = BackgroundImage;
const backgroundWithImageStyle: CSSProperties = {
  backgroundImage: `url(${backgroundImageSrc})`,
  backgroundSize: "cover",
};

const Layout = ({ children }: PropsWithChildren<unknown>) => {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const { theme } = useTheme();

  return (
    <div
      className={cx(
        "text-foreground bg-background w-screen",
        "h-screen overflow-x-hidden overflow-y-hidden",
        "transition-all duration-300",
      )}
      style={isLoginPage ? backgroundWithImageStyle : {}}
    >
      <main
        className={cx(
          "h-full w-full flex flex-col pb-[110px] overflow-y-auto",
          POPPINS_CLASS,
        )}
      >
        <Navbar />
        <div className="px-8 flex flex-col flex-grow">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
