import { fileToClassNames } from "../file-to-class-names";

describe("fileToClassNames", () => {
  test("it converts a file path to an array of class names (default camel cased)", async () => {
    const result = await fileToClassNames(`${__dirname}/style.scss`);

    expect(result).toEqual(["someStyles", "nestedClass", "nestedAnother"]);
  });

  describe("nameFormat", () => {
    test("it converts a file path to an array of class names with kebab as the name format", async () => {
      const result = await fileToClassNames(`${__dirname}/style.scss`, {
        nameFormat: "kebab"
      });

      expect(result).toEqual(["some-styles", "nested-class", "nested-another"]);
    });

    test("it converts a file path to an array of class names with param as the name format", async () => {
      const result = await fileToClassNames(`${__dirname}/style.scss`, {
        nameFormat: "param"
      });

      expect(result).toEqual(["some-styles", "nested-class", "nested-another"]);
    });
  });
});
