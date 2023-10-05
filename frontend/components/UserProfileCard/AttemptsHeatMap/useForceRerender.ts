import useDebounce from "@/hooks/useDebounce";
import { useState, useEffect } from "react";

export const useForceRerender = () => {
  const [heatMapKey, setHeatMapKey] = useState(new Date().toDateString());
  useEffect(() => {
    window.addEventListener(
      "resize",
      () => setHeatMapKey(new Date().toDateString(),
      ));
  }, []);
  return useDebounce(heatMapKey, 500);
};
