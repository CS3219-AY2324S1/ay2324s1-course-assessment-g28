import { CSSProperties } from "react";
import cx from "classnames";
import { Button } from "@nextui-org/react";

type ErrorCardProps = {
  className?: string;
  styles?: CSSProperties;
  onRetry?: () => void;
  isLoading?: boolean;
};

const ErrorCard = (props?: ErrorCardProps) => {
  const { className, styles, onRetry, isLoading } = props ?? {};
  return (
    <div
      className={cx(
        "h-[350px] flex flex-col items-center justify-center",
        className,
      )}
      style={styles}
    >
      <div className="text-[18px] font-semibold mb-4">
        {"Something went wrong :("}
      </div>
      {onRetry ? (
        <Button color="secondary" isLoading={isLoading} onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
};

export default ErrorCard;
