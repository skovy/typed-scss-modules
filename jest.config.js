module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.+(ts|tsx|js)"],
  testPathIgnorePatterns: [
    "<rootDir>/dist/",
    "<rootDir>/node_modules/",
    "(.*).d.ts"
  ],
  moduleFileExtensions: ["ts", "tsx", "js"],
  modulePathIgnorePatterns: ["dist"]
};
