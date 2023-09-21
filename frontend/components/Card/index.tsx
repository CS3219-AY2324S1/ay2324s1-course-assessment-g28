import { CSSProperties, PropsWithChildren } from "react";
import cx from "classnames";

interface CardProps {
  classNames?: string;
  styles?: CSSProperties;
}

const Card = (props: PropsWithChildren<CardProps>) => {
  const { children, classNames, styles } = props;
  return (
    <div
      className={cx("p-[12px] bg-brand-white rounded-xl", classNames)}
      style={styles}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
