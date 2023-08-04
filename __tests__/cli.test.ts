import { execSync } from "child_process";

describe("cli", () => {
  it("should run when no files are found", () => {
    const result = execSync("npm run typed-scss-modules src").toString();

    expect(result).toContain("No files found.");
  });

  describe("examples", () => {
    it("should run the basic example without errors", () => {
      const result = execSync(
        `npm run typed-scss-modules "examples/basic/**/*.scss" -- --includePaths examples/basic/core --aliases.~alias variables --banner '// example banner'`
      ).toString();

      expect(result).toContain("Found 3 files. Generating type definitions...");
    });

    it("should run the default-export example without errors", () => {
      const result = execSync(
        `npm run typed-scss-modules "examples/default-export/**/*.scss" -- --exportType default --nameFormat kebab --banner '// example banner'`
      ).toString();

      expect(result).toContain("Found 1 file. Generating type definitions...");
    });
  });
});
