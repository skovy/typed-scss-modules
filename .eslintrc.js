/* eslint-env node */
module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest-formatting/strict",
    "plugin:jest/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "promise", "jest", "jest-formatting"],
  ignorePatterns: ["dist/**"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      extends: [
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      parserOptions: {
        project: ["./tsconfig.json"],
      },
    },
  ],
  rules: {
    "promise/prefer-await-to-then": "error",
    "jest/consistent-test-it": ["error", { fn: "it" }],
  },
};
