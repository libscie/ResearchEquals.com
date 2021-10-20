// tailwind.config.js
module.exports = {
  mode: "jit",
  purge: ["{pages,app}/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        120: "35rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
