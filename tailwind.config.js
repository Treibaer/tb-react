const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customBlue: "rgb(38, 41, 57);",
      },
      borderRadius: {
        "custom-tb": "4px",
      },
      fontFamily: {
        // sans: ['Inter var', ...defaultTheme.fontFamily.sans],
        sans: ["Inter UI", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
