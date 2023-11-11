import { useIsIntersecting } from "@/hooks/useIsIntersecting";
import { useRef } from "react";
import { CALL_TO_ACTION } from "../..";
import LoginButtonGroup, { Providers } from "../../LoginButtonGroup";
import cx from "classnames";
import LanguageCard from "./LanguageCard";

const CallToActionCard = (props: { providers?: Providers }) => {
  const ref = useRef(null);
  const isInView = useIsIntersecting(ref);

  return (
    <div
      ref={ref}
      className={cx(
        "w-full h-fit mb-[180px] text-center transition-all",
        isInView ? "opacity-100" : "opacity-10",
      )}
    >
      <div
        id={CALL_TO_ACTION}
        className="cursor-default text-[3em] font-semibold"
      >
        Start coding!
      </div>
      <LanguageCard />
      <LoginButtonGroup {...props} />
    </div>
  );
};

export default CallToActionCard;
