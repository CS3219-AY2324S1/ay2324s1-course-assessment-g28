import { Poppins } from "next/font/google";

const poppins = Poppins({ weight: "400", subsets: ["latin-ext"] });

export const { className: POPPINS_CLASS, style: POPPINS_STYLE } = poppins;
