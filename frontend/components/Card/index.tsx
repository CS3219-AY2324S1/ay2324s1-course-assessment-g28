import { CSSProperties, PropsWithChildren } from "react";
import cx from "classnames";

interface CardProps {
  className?: string;
  styles?: CSSProperties;
}

const Card = ({
  children,
  className: classNames,
  styles,
  ...props
}: PropsWithChildren<CardProps>) => {
  return (
    <div
      className={cx("p-[24px] bg-content1 rounded-xl", classNames)}
      style={styles}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
