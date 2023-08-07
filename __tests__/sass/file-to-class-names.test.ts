import { fileToClassNames } from "../../lib/sass";
import { describeAllImplementations } from "../helpers";

describeAllImplementations((implementation) => {
  describe("fileToClassNames", () => {
    it("converts a file path to an array of class names (default camel cased)", async () => {
      const result = await fileToClassNames(
        `${__dirname}/../dummy-styles/complex.scss`
      );

      expect(result).toEqual([
        "nestedAnother",
        "nestedClass",
        "number1",
        "someStyles",
        "whereSelector",
      ]);
    });

    describe("nameFormat", () => {
      it("converts a file path to an array of class names with kebab as the name format", async () => {
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
          "where-selector",
        ]);
      });

      it("converts a file path to an array of class names with param as the name format", async () => {
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
          "where-selector",
        ]);
      });

      it("converts a file path to an array of class names with snake as the name format", async () => {
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
          "where_selector",
        ]);
      });

      it("converts a file path to an array of class names where only classes with dashes in the names are altered", async () => {
        const result = await fileToClassNames(
          `${__dirname}/../dummy-styles/dashes.scss`,
          {
            nameFormat: ["dashes"],
            implementation,
          }
        );

        expect(result).toEqual(["App", "appHeader", "Logo"]);
      });

      it("does not change class names when nameFormat is set to none", async () => {
        const result = await fileToClassNames(
          `${__dirname}/../dummy-styles/dashes.scss`,
          {
            nameFormat: ["none"],
            implementation,
          }
        );

        expect(result).toEqual(["App", "App-Header", "Logo"]);
      });

      it("applies all transformers when is set to all", async () => {
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
          "where_selector",
          "where-selector",
          "whereSelector",
        ]);
      });

      it("applies multiple transformers when sent as an array", async () => {
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
          "where_selector",
          "where-selector",
        ]);
      });

      it("handles only a string", async () => {
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
          "where_selector",
        ]);
      });
    });

    describe("aliases", () => {
      it("converts a file that contains aliases", async () => {
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
          "whereSelector",
        ]);
      });
    });

    describe("aliasPrefixes", () => {
      it("converts a file that contains alias prefixes (but prioritizes aliases)", async () => {
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
          "whereSelector",
        ]);
      });
    });

    describe("composes", () => {
      it("converts a file that contains a composes dependency from another file", async () => {
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
      it("adds additional data to enable adding any necessary context", async () => {
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
