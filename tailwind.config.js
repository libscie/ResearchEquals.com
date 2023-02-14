// tailwind.config.js
const colors = require("tailwindcss/colors")

module.exports = {
  content: ["{pages,app}/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        tilt: "tilt 10s infinite linear",
      },
      colors: {
        sky: colors.sky,
        teal: colors.teal,
        rose: colors.rose,
      },
      keyframes: {
        tilt: {
          "0%, 50%, 100%": {
            transform: "rotate(0deg)",
          },
          "25%": {
            transform: "rotate(1deg)",
          },
          "75%": {
            transform: "rotate(-1deg)",
          },
        },
      },
      screens: {
        xs: "340px",
        modscreen: "916px",
      },
      fontFamily: {
        sans: ["Noto Sans Display", "system-ui"],
        serif: ["Noto Serif", "system-ui"],
      },
      spacing: {
        120: "35rem",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp"), require("@tailwindcss/forms")],
}
