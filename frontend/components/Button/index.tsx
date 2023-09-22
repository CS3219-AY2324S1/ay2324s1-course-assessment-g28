import { Button as NextButton } from "@nextui-org/react";
import { CSSProperties, PropsWithChildren } from "react";
import cx from "classnames";

interface ButtonProps {
  onClick?: () => void;
  classnames?: string;
  styles?: CSSProperties;
}

const Button = (props: PropsWithChildren<ButtonProps>) => {
  const { onClick, classnames, styles, children } = props ?? {};
  return (
    <NextButton
      onClick={onClick}
      className={cx(
        "text-[#8657A6] rounded-full bg-opacity-80",
        "transition hover:bg-white transition-colors-opacity",
        classnames,
      )}
      style={styles}
      {...props}
    >
      {children}
    </NextButton>
  );
};

export default Button;
