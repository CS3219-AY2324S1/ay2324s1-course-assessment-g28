import { Card } from "@nextui-org/react";
import ImageCard, { ImageCardProps } from "./ImageCard";
import cx from "classnames";
import { ReactNode, useRef } from "react";
import { useIsIntersecting } from "@/hooks/useIsIntersecting";

export enum ContentPosition {
  LEFT = "left",
  RIGHT = "right",
}

/**
 * content:        Content of card. Undefined means hide content card
 * contentPostion: Determine content is left or right
 * imageProps:     Props for iamge card. Falsy means hide image
 */
export type TemplateCardProps = {
  content?: ReactNode;
  contentPosition?: ContentPosition;
  imageProps?: ImageCardProps;
  wrapperClassName?: string;
  contentClassName?: string;
};

const TemplateCard = ({
  content,
  contentPosition,
  imageProps,
  wrapperClassName,
  contentClassName,
}: TemplateCardProps) => {
  const ref = useRef(null);
  const isInView = useIsIntersecting(ref);

  const textContent = (className?: string) =>
    content !== undefined && (
      <div>
        <Card
          className={cx(
            "w-fit flex flex-col gap-3 z-[999] bg-content2",
            "dark:bg-[#212121]",
            className,
            contentClassName,
          )}
          shadow="lg"
        >
          <div className="m-[36px]">{content}</div>
        </Card>
      </div>
    );
  return (
    <div ref={ref}>
      <div
        className={cx(
          "pb-[64px] mb-20 h-fit items-start justify-center flex m-auto .",
          "transition-all",
          wrapperClassName,
          isInView
            ? "opacity-100 translate-y-0"
            : "opacity-10 translate-y-[150px]",
        )}
      >
        {contentPosition === ContentPosition.LEFT
          ? textContent(imageProps ? "mr-[-150px]" : "")
          : null}
        {imageProps ? <ImageCard {...imageProps} /> : null}
        {contentPosition === ContentPosition.RIGHT
          ? textContent(imageProps ? "ml-[-150px]" : "")
          : null}
      </div>
    </div>
  );
};

export default TemplateCard;
