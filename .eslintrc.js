module.exports = {
  extends: [
    "eslint-config-next",
    "prettier",
    // "eslint:recommended",
    // "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  ignorePatterns: ["*.d.ts"],
  settings: {
    next: {
      rootDir: ["./apps/*/", "./packages/*/"],
    },
  },
  rules: {
    "@next/next/no-html-link-for-pages": "off",
  },
  overrides: [
    {
      files: ["**/*.ts?(x)"],
      plugins: ["@typescript-eslint"],
      parserOptions: {
        project: "./tsconfig.json",
      },
      rules: {
        "@typescript-eslint/no-floating-promises": "error",
        "no-use-before-define": "off",
        "@typescript-eslint/no-use-before-define": ["off"],
        "no-redeclare": "off",
        "@typescript-eslint/no-redeclare": ["error"],
        "react/display-name": "off",
      },
    },
  ],
}
