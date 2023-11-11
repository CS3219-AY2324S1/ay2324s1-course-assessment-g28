import cx from "classnames";
import { RACING_SANS_ONE_CLASS } from "@/assets/fonts/racingSansOne";
import LoginButtonGroup, { Providers } from "../../LoginButtonGroup";
import TemplateCard, { ContentPosition } from "../TemplateCard";
import darkImage from "./all-questions-dark.jpg";
import lightImage from "./all-questions-light.jpg";

const Card1 = ({ providers }: { providers?: Providers }) => {
  return (
    <TemplateCard
      contentPosition={ContentPosition.LEFT}
      contentClassName="mt-[25px]"
      wrapperClassName="pt-[64px] pb-[120px]"
      content={
        <div>
          <div className="cursor-default">welcome to</div>
          <div className={cx(RACING_SANS_ONE_CLASS, "text-8xl mb-5")}>
            PeerPrep
          </div>
          <div className="flex justify-end w-full">
            {providers ? <LoginButtonGroup providers={providers} /> : null}
          </div>
        </div>
      }
      imageProps={{ darkImage, lightImage, alt: "login-card-1" }}
    />
  );
};

export default Card1;
