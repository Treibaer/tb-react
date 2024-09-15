const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customBlue: "rgb(38, 41, 57);",
        olive: "olive",
        darkBlue: "#191a23",
        mediumBlue: "rgb(32,33,46)",
        hoverBlue: "rgb(28,29,42)",
        mediumBlue3: "#262736",
        borderBlue: "#262736",
        // mediumBlue2: "rgb(28,29,42)",
        lightBlue: "rgb(53,56,74)",
        focusBlue: "rgb(73,76,94)",
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
