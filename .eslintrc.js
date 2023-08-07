/* eslint-env node */
module.exports = {
  root: true,
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
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
};
