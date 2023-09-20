import { PropsWithChildren } from "react";
import cx from "classnames";
import { POPPINS_CLASS } from "@/assets/fonts/poppins";
import Navbar from "@/components/Navbar";

const Layout = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <>
      <Navbar />
      <main
        className={cx("flex min-h-screen flex-col items-center", POPPINS_CLASS)}
      >
        {children}
      </main>
    </>
  );
};

export default Layout;
