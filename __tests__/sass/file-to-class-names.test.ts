import { fileToClassNames } from "../../lib/sass";

describe("fileToClassNames", () => {
  test("it converts a file path to an array of class names (default camel cased)", async () => {
    const result = await fileToClassNames(`${__dirname}/../complex.scss`);

    expect(result).toEqual(["someStyles", "nestedClass", "nestedAnother"]);
  });

  describe("nameFormat", () => {
    test("it converts a file path to an array of class names with kebab as the name format", async () => {
      const result = await fileToClassNames(`${__dirname}/../complex.scss`, {
        nameFormat: "kebab"
      });

      expect(result).toEqual(["some-styles", "nested-class", "nested-another"]);
    });

    test("it converts a file path to an array of class names with param as the name format", async () => {
      const result = await fileToClassNames(`${__dirname}/../complex.scss`, {
        nameFormat: "param"
      });

      expect(result).toEqual(["some-styles", "nested-class", "nested-another"]);
    });
  });

  describe("aliases", () => {
    test("it converts a file that contains aliases", async () => {
      const result = await fileToClassNames(`${__dirname}/../aliases.scss`, {
        aliases: {
          "~fancy-import": "complex",
          "~another": "style"
        }
      });

      expect(result).toEqual([
        "someStyles",
        "nestedClass",
        "nestedAnother",
        "someClass",
        "myCustomClass"
      ]);
    });
  });

  describe("aliasPrefixes", () => {
    test("it converts a file that contains alias prefixes (but prioritizes aliases)", async () => {
      const result = await fileToClassNames(
        `${__dirname}/../alias-prefixes.scss`,
        {
          aliases: {
            "~fancy-import": "complex"
          },
          aliasPrefixes: {
            "~": "nested-styles/"
          }
        }
      );

      expect(result).toEqual([
        "someStyles",
        "nestedClass",
        "nestedAnother",
        "nestedStyles",
        "myCustomClass"
      ]);
    });
  });
});
