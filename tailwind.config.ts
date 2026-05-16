import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9eaff",
          200: "#bcd9ff",
          300: "#8ec0ff",
          400: "#599cff",
          500: "#3478f6",
          600: "#1f5be0",
          700: "#1a47b3",
          800: "#193d8c",
          900: "#1a356f",
        },
      },
      boxShadow: {
        soft: "0 4px 16px -4px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
