import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.{css,scss}",
  ],
  theme: {
    extend: {
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
        '7xl': '5rem',
      },
      colors: {
        light: {
          cream: "#f5f5dc",
          sand: "#e0cda9",
        },
        dark: {
          navy: "#001f3f",
          darkGreen: "#013220",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
