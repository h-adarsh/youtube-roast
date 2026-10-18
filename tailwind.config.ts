import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    screens: {
      xs: "400px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        karl: {
          yellow: "#ffe600",
          azure: "#007fff",
          coral: "#ef3b2c",
          charcoal: "#333333",
          white: "#ffffff",
        },
        roast: {
          dark: "#ffe600",
          card: "#ffffff",
          cardHover: "#fff8b3",
          border: "#333333",
          red: "#ef3b2c",
          fire: "#ef3b2c",
          orange: "#007fff",
          yellow: "#ffe600",
          purple: "#333333",
          blue: "#007fff",
        },
      },
      fontFamily: {
        display: ["'Changa One'", "Arial", "sans-serif"],
        sans: ["Arial", "Helvetica", "sans-serif"],
        arial: ["Arial", "Helvetica", "sans-serif"],
      },
      borderRadius: {
        none: "0px",
        globe: "1440px",
      },
      lineHeight: {
        display: "0.72",
        heading: "0.80",
        "heading-sm": "1.00",
        subheading: "1.25",
      },
    },
  },
  plugins: [],
};

export default config;
