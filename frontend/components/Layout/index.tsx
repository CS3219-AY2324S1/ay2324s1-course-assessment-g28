import { PropsWithChildren } from "react";
import cx from "classnames";
import { POPPINS_CLASS } from "@/assets/fonts/poppins";
import Navbar from "@/components/Navbar";

const Layout = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <div
      className={cx(
        "text-foreground bg-background w-screen",
        "h-screen overflow-x-hidden overflow-y-hidden",
        "!transition-all duration-300 flex flex-col",
      )}
    >
      <main
        className={cx(
          "h-full w-full flex flex-col overflow-y-auto max-h-full",
          POPPINS_CLASS,
        )}
      >
        <Navbar />
        <div className="px-8 pb-8 flex flex-col flex-grow overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
