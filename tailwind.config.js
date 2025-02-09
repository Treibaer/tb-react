/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customBlue: "rgb(38, 41, 57);",
        olive: "#4b7523",
        background: "#101010",
        header: "#2c2c2c",
        hover: "#282828",
        border: "#444444",
        row: "#222222",
        section: "#171717",
        transparentSection: "rgba(26,26,26,0.5)",
        transparentRow: "rgba(30,30,30,0.95)",
        transparentDialog: "rgba(26,26,26,0.6)",
        text: "#E0E0E0",
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
