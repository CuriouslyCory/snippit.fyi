import { type Config } from "tailwindcss";
// import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {},
      gridTemplateRows: {
        a1a: "auto 1fr auto",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
