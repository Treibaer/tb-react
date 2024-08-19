/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customBlue: "rgb(38, 41, 57);",
      },
      borderRadius: {
        'custom-tb': '4px',
      },
    },
  },
  plugins: [],
};
