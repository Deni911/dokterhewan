/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1e40af",
        secondary: "#0891b2",
        accent: "#ea580c",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        display: ["Lora", "serif"],
      },
    },
  },
  plugins: [],
};
