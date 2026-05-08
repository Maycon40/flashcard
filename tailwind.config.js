/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // ... outros caminhos
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"), // <--- Adicione esta linha
  ],
};
