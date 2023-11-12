import Image, { StaticImageData } from "next/image";
import cx from "classnames";
import { useTheme } from "next-themes";
import { useState, useEffect, useMemo } from "react";

export type ImageCardProps = {
  darkImage: StaticImageData;
  lightImage: StaticImageData;
  alt: string;
  className?: string;
};

const ImageCard = ({
  darkImage,
  lightImage,
  alt,
  className,
}: ImageCardProps) => {
  const { theme } = useTheme();
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  const isDark = useMemo(() => theme === "dark", [theme]);
  return (
    <div
      className={cx(
        "w-[60%] max-w-[750px] rounded-xl bg-white",
        "hover:scale-105 transition-transform",
        className,
      )}
    >
      {hasMounted ? (
        <Image
          src={isDark ? darkImage : lightImage}
          alt={alt}
          className="rounded-xl transition-transform"
          style={{
            filter: "opacity(0.9) blur(0.2px)",
          }}
          priority
        />
      ) : null}
    </div>
  );
};

export default ImageCard;
