import { useState, useEffect } from "react";

const useDebounce = <T>(value: T, delayMiliseconds: number) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMiliseconds);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMiliseconds]);

  return debouncedValue;
};

export default useDebounce;
