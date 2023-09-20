import { RACING_SANS_ONE_CLASS } from "@/assets/fonts/racingSansOne";
import { NavbarBrand } from "@nextui-org/react";
import cx from "classnames";

const Brand = () => (
  <NavbarBrand>
    <div className={cx("font-bold text-xl", RACING_SANS_ONE_CLASS)}>
      PeerPrep
    </div>
  </NavbarBrand>
);

export default Brand;
