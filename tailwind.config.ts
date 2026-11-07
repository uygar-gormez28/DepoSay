import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bgMain: "#101827",
        bgSecondary: "#172235",
        bgCard: "#1E293B",
        borderCustom: "#334155",
        textMain: "#F8FAFC",
        textMuted: "#94A3B8",
      },
    },
  },
  plugins: [],
} satisfies Config;
