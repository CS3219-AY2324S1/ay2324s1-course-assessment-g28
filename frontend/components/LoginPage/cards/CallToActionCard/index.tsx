import { useIsIntersecting } from "@/hooks/useIsIntersecting";
import { useRef } from "react";
import { CALL_TO_ACTION } from "../..";
import LoginButtonGroup, { Providers } from "../../LoginButtonGroup";
import cx from "classnames";

const CallToActionCard = (props: { providers?: Providers }) => {
  const ref = useRef(null);
  const isInView = useIsIntersecting(ref);

  return (
    <div
      ref={ref}
      className={cx(
        "w-full h-[200px] mb-40 text-center transition-all",
        isInView ? "opacity-100" : "opacity-10",
      )}
    >
      <div id={CALL_TO_ACTION} className="text-[3em] font-semibold mb-3">
        Start coding!
      </div>
      <LoginButtonGroup {...props} />
    </div>
  );
};

export default CallToActionCard;
