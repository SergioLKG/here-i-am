/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          a0: "#ffffff",
          a10: "#d2d1e4",
          a20: "#a6a6c9",
          a30: "#7a7caf",
          a40: "#4e5595",
          a50: "#18317b",
          a60: "#192862",
          a70: "#182049",
          a80: "#141832",
          a90: "#0f0e1d",
          a100: "#000000",
        },
      },
      animation: {
        moveBackground: "moveBackground 30s linear infinite",
      },
      keyframes: {
        floatingBackground: {
          "0%": {
            backgroundPosition: "50% 50%",
            transform: "scale(1) translate(0, 0)",
          },
          "25%": {
            backgroundPosition: "48% 52%",
            transform: "scale(1.02) translate(-2px, 3px)",
          },
          "50%": {
            backgroundPosition: "52% 48%",
            transform: "scale(1.01) translate(3px, -2px)",
          },
          "75%": {
            backgroundPosition: "49% 51%",
            transform: "scale(1.03) translate(-1px, 2px)",
          },
          "100%": {
            backgroundPosition: "50% 50%",
            transform: "scale(1) translate(0, 0)",
          },
        },
        pseudoMove: {
          "0%": { transform: "translate(0, 0)" },
          "100%": { transform: "translate(-100px, -100px)" },
        },
      },
    },
  },
  plugins: [],
};
