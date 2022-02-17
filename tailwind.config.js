// tailwind.config.js
module.exports = {
  content: ["{pages,app}/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "340px",
        modscreen: "916px",
      },
      fontFamily: {
        sans: ["Noto Sans Display", "system-ui"],
      },
      spacing: {
        120: "35rem",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp"), require("@tailwindcss/forms")],
}
