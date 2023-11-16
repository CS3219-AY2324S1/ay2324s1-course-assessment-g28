import { Racing_Sans_One } from "next/font/google";

const racingSansOne = Racing_Sans_One({
  weight: "400",
  subsets: ["latin-ext"],
});

export const {
  className: RACING_SANS_ONE_CLASS,
  style: RACING_SANS_ONE_STYKE,
} = racingSansOne;
