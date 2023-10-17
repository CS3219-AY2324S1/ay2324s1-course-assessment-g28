import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    minHeight: {
      'screen-1/2': '50vh',
      'screen-2/3': '67vh',
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "brand-white": "#D9D9D9",
      },
      typography(theme: any) {
        return {
          DEFAULT: {
            css: {
              "code::before": {
                content: "none", // don’t generate the pseudo-element
                //                content: '""', // this is an alternative: generate pseudo element using an empty string
              },
              "code::after": {
                content: "none",
              },
              code: {
                color: theme("colors.slate.500"),
                backgroundColor: theme("colors.stone.100"),
                borderRadius: theme("borderRadius.DEFAULT"),
                paddingLeft: theme("spacing[1.5]"),
                paddingRight: theme("spacing[1.5]"),
                paddingTop: theme("spacing.1"),
                paddingBottom: theme("spacing.1"),
              },
            },
          },
        };
      },
    },
  },
  darkMode: "class",
  plugins: [nextui(), require("@tailwindcss/typography")],
};
export default config;
