import { CSSProperties, useEffect, useState } from "react";

export const useAppearAnimation = (): CSSProperties => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (isVisible) {
    return {
      opacity: 1,
      transition: "all 400ms ease",
      transitionDelay: "150ms",
      filter: "blur(0rem)",
      transform: "translateY(0%)",
    };
  } else {
    return {
      transition: "all 400ms ease",
      opacity: 0,
      filter: "blur(0rem)",
      transform: "translateY(100%)",
    };
  }
};