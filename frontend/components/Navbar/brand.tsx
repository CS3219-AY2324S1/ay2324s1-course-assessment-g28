import { RACING_SANS_ONE_CLASS } from "@/assets/fonts/racingSansOne";
import { HOME } from "@/routes";
import { NavbarBrand } from "@nextui-org/react";
import cx from "classnames";
import { useRouter } from "next/router";

const Brand = () => {
  const router = useRouter();
  return (
    <NavbarBrand>
      <div
        className={cx(
          "font-bold text-xl w-fit cursor-pointer hover:text-purple-300",
          RACING_SANS_ONE_CLASS,
        )}
        onClick={() => router.push(HOME)}
      >
        PeerPrep
      </div>
    </NavbarBrand>
  );
};

export default Brand;
