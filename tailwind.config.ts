import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tac: {
          bg: "#0a0c08",
          charcoal: "#141711",
          olive: "#1c2416",
          olive2: "#232d1a",
          green: "#5fa86a",
          orange: "#e8a33d",
          gray: "#8a8f83",
          paper: "#e8e6da",
          dim: "#b5b3a5",
          cyan: "#4fa3c7",
        },
      },
      fontFamily: {
        mono: ['"Space Mono"', "ui-monospace", "monospace"],
        display: ['"Space Grotesk"', "Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
