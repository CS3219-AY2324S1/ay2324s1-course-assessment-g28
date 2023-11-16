import { CALL_TO_ACTION } from ".";

export const scrollTillCallToAction = (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
) => {
  e.preventDefault();
  const elem = document.getElementById(CALL_TO_ACTION);
  elem?.scrollIntoView({
    behavior: "smooth",
  });
};
