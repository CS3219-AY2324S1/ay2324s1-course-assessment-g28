import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { CiDark } from "react-icons/ci";
import { BsSun } from "react-icons/bs";
import { Tooltip } from "@nextui-org/react";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const isDark = useMemo(() => theme === "dark", [theme]);

  const handleClick = () => {
    if (isDark) {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  if (!hasMounted) {
    return null;
  }

  return (
    <Tooltip
      content={`Change to ${isDark ? "light" : "dark"} mode`}
      className="text-foreground"
    >
      <div onClick={handleClick} className="cursor-pointer">
        {isDark ? <CiDark /> : <BsSun />}
      </div>
    </Tooltip>
  );
};

export default ThemeSwitcher;
