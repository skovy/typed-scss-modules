import { fileToClassNames } from "../../lib/sass/index.js";

import { describeAllImplementations } from "../helpers/index.js";
import { fileURLToPath } from "url";
import { Implementations } from "lib/implementations/index.js";
const __dirname = fileURLToPath(new URL(".", import.meta.url));
describeAllImplementations((implementation: Implementations) => {
  describe("fileToClassNames", () => {
    test("it converts a file path to an array of class names (default camel cased)", async () => {
      const result = await fileToClassNames(
        `${__dirname}/../dummy-styles/complex.scss`
      );

      expect(result).toEqual([
        "nestedAnother",
        "nestedClass",
        "number1",
        "someStyles",
      ]);
    });

    describe("nameFormat", () => {
      test("it converts a file path to an array of class names with kebab as the name format", async () => {
        const result = await fileToClassNames(
          `${__dirname}/../dummy-styles/complex.scss`,
          {
            nameFormat: ["kebab"],
            implementation,
          }
        );

        expect(result).toEqual([
          "nested-another",
          "nested-class",
          "number-1",
          "some-styles",
        ]);
      });

      test("it converts a file path to an array of class names with param as the name format", async () => {
        const result = await fileToClassNames(
          `${__dirname}/../dummy-styles/complex.scss`,
          {
            nameFormat: ["param"],
            implementation,
          }
        );

        expect(result).toEqual([
          "nested-another",
          "nested-class",
          "number-1",
          "some-styles",
        ]);
      });

      test("it converts a file path to an array of class names with snake as the name format", async () => {
        const result = await fileToClassNames(
          `${__dirname}/../dummy-styles/complex.scss`,
          {
            nameFormat: ["snake"],
            implementation,
          }
        );

        expect(result).toEqual([
          "nested_another",
          "nested_class",
          "number_1",
          "some_styles",
        ]);
      });

      test("it converts a file path to an array of class names where only classes with dashes in the names are altered", async () => {
        const result = await fileToClassNames(
          `${__dirname}/../dummy-styles/dashes.scss`,
          {
            nameFormat: ["dashes"],
            implementation,
          }
        );

        expect(result).toEqual(["App", "appHeader", "Logo"]);
      });

      test("it does not change class names when nameFormat is set to none", async () => {
        const result = await fileToClassNames(
          `${__dirname}/../dummy-styles/dashes.scss`,
          {
            nameFormat: ["none"],
            implementation,
          }
        );

        expect(result).toEqual(["App", "App-Header", "Logo"]);
      });

      test("it applies all transformers when is set to all", async () => {
        const result = await fileToClassNames(
          `${__dirname}/../dummy-styles/complex.scss`,
          {
            nameFormat: ["all"],
            implementation,
          }
        );

        expect(result).toEqual([
          "nested_another",
          "nested_class",
          "nested-another",
          "nested-class",
          "nestedAnother",
          "nestedClass",
          "number_1",
          "number-1",
          "number1",
          "some_styles",
          "some-styles",
          "someStyles",
        ]);
      });

      test("it applies multiple transformers when sent as an array", async () => {
        const result = await fileToClassNames(
          `${__dirname}/../dummy-styles/complex.scss`,
          {
            nameFormat: ["kebab", "snake"],
            implementation,
          }
        );

        expect(result).toEqual([
          "nested_another",
          "nested_class",
          "nested-another",
          "nested-class",
          "number_1",
          "number-1",
          "some_styles",
          "some-styles",
        ]);
      });

      test("it handles only a string", async () => {
        const result = await fileToClassNames(
          `${__dirname}/../dummy-styles/complex.scss`,
          {
            nameFormat: "snake",
            implementation,
          }
        );

        expect(result).toEqual([
          "nested_another",
          "nested_class",
          "number_1",
          "some_styles",
        ]);
      });
    });

    describe("aliases", () => {
      xtest("it converts a file that contains aliases", async () => {
        const result = await fileToClassNames(
          `${__dirname}/../dummy-styles/aliases.scss`,
          {
            aliases: {
              "~fancy-import": "complex",
              "~another": "style",
            },
            implementation,
          }
        );

        expect(result).toEqual([
          "myCustomClass",
          "nestedAnother",
          "nestedClass",
          "number1",
          "someClass",
          "someStyles",
        ]);
      });
    });

    describe("aliasPrefixes", () => {
      xtest("it converts a file that contains alias prefixes (but prioritizes aliases)", async () => {
        const result = await fileToClassNames(
          `${__dirname}/../dummy-styles/alias-prefixes.scss`,
          {
            aliases: {
              "~fancy-import": "complex",
            },
            aliasPrefixes: {
              "~": "nested-styles/",
            },
            implementation,
          }
        );

        expect(result).toEqual([
          "myCustomClass",
          "nestedAnother",
          "nestedClass",
          "nestedStyles",
          "number1",
          "someStyles",
        ]);
      });
    });

    describe("composes", () => {
      test("it converts a file that contains a composes dependency from another file", async () => {
        const result = await fileToClassNames(
          `${__dirname}/../dummy-styles/composes.scss`,
          {
            implementation,
          }
        );

        expect(result).toEqual(["composedClass"]);
      });
    });

    describe("additionalData", () => {
      test("adds additional data to enable adding any necessary context", async () => {
        const result = await fileToClassNames(
          `${__dirname}/../dummy-styles/global-variables.scss`,
          {
            implementation,
            additionalData: "$global-red: red;",
          }
        );

        expect(result).toEqual(["globalStyle"]);
      });
    });
  });
});
