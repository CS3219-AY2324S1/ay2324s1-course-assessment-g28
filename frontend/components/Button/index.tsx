import {
  Button as NextButton,
  ButtonProps as NextButtonProps,
} from "@nextui-org/react";
import { CSSProperties, PropsWithChildren } from "react";
import cx from "classnames";

type ButtonProps = {
  onClick?: () => void;
  className?: string;
  styles?: CSSProperties;
} & NextButtonProps;

const Button = (props: PropsWithChildren<ButtonProps>) => {
  const {
    onClick,
    className: classnames,
    styles,
    children,
    ...rest
  } = props ?? {};
  return (
    <NextButton
      onClick={onClick}
      className={cx(
        "text-foreground hover:scale-110 hover:transition-transform mx-2",
        classnames,
      )}
      style={styles}
      {...rest}
    >
      {children}
    </NextButton>
  );
};

export default Button;
