import { RefObject, useEffect, useState } from "react";

export const useIsIntersecting = (ref: RefObject<Element>) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref?.current) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        // wont "unintersect" once we scroll pass it
        if (entry.isIntersecting) setIsIntersecting(true);
      },
      { rootMargin: "-220px" },
    );
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [isIntersecting, ref]);

  return isIntersecting;
};
