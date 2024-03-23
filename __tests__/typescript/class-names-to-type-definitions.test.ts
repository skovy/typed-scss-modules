import os from "os";
import { join } from "path";
import { classNamesToTypeDefinitions } from "../../lib/typescript";

jest.mock("../../lib/prettier/can-resolve", () => ({
  canResolvePrettier: () => false,
}));
const file = join(__dirname, "test.d.ts");

describe("classNamesToTypeDefinitions (without Prettier)", () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  describe("named", () => {
    it("converts an array of class name strings to type definitions", async () => {
      const definition = await classNamesToTypeDefinitions({
        banner: "",
        classNames: ["myClass", "yourClass"],
        exportType: "named",
        file,
      });

      expect(definition).toEqual(
        "export declare const myClass: string;\nexport declare const yourClass: string;\n"
      );
    });

    it("returns null if there are no class names", async () => {
      const definition = await classNamesToTypeDefinitions({
        banner: "",
        classNames: [],
        exportType: "named",
        file,
      });

      expect(definition).toBeNull();
    });

    it("prints a warning if a classname is a reserved keyword and does not include it in the type definitions", async () => {
      const definition = await classNamesToTypeDefinitions({
        banner: "",
        classNames: ["myClass", "if"],
        exportType: "named",
        file,
      });

      expect(definition).toEqual("export declare const myClass: string;\n");
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining(`[SKIPPING] 'if' is a reserved keyword`)
      );
    });

    it("prints a warning if a classname is invalid and does not include it in the type definitions", async () => {
      const definition = await classNamesToTypeDefinitions({
        banner: "",
        classNames: ["myClass", "invalid-variable"],
        exportType: "named",
        file,
      });

      expect(definition).toEqual("export declare const myClass: string;\n");
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining(`[SKIPPING] 'invalid-variable' contains dashes`)
      );
    });
  });

  describe("default", () => {
    it("converts an array of class name strings to type definitions", async () => {
      const definition = await classNamesToTypeDefinitions({
        banner: "",
        classNames: ["myClass", "yourClass"],
        exportType: "default",
        file,
      });

      expect(definition).toEqual(
        "export type Styles = {\n  'myClass': string;\n  'yourClass': string;\n};\n\nexport type ClassNames = keyof Styles;\n\ndeclare const styles: Styles;\n\nexport default styles;\n"
      );
    });

    it("returns null if there are no class names", async () => {
      const definition = await classNamesToTypeDefinitions({
        banner: "",
        classNames: [],
        exportType: "default",
        file,
      });

      expect(definition).toBeNull();
    });
  });

  describe("invalid export type", () => {
    it("returns null", async () => {
      const definition = await classNamesToTypeDefinitions({
        banner: "",
        classNames: ["myClass"],
        // @ts-expect-error -- invalid export type
        exportType: "invalid",
        file,
      });

      expect(definition).toBeNull();
    });
  });

  describe("quoteType", () => {
    it("uses double quotes for default exports when specified", async () => {
      const definition = await classNamesToTypeDefinitions({
        banner: "",
        classNames: ["myClass", "yourClass"],
        exportType: "default",
        quoteType: "double",
        file,
      });

      expect(definition).toEqual(
        'export type Styles = {\n  "myClass": string;\n  "yourClass": string;\n};\n\nexport type ClassNames = keyof Styles;\n\ndeclare const styles: Styles;\n\nexport default styles;\n'
      );
    });

    it("does not affect named exports", async () => {
      const definition = await classNamesToTypeDefinitions({
        banner: "",
        classNames: ["myClass", "yourClass"],
        exportType: "named",
        quoteType: "double",
        file,
      });

      expect(definition).toEqual(
        "export declare const myClass: string;\nexport declare const yourClass: string;\n"
      );
    });
  });

  describe("exportType name and type attributes", () => {
    it("uses custom value for ClassNames type name", async () => {
      const definition = await classNamesToTypeDefinitions({
        banner: "",
        classNames: ["myClass", "yourClass"],
        exportType: "default",
        exportTypeName: "Classes",
        file,
      });

      expect(definition).toEqual(
        "export type Styles = {\n  'myClass': string;\n  'yourClass': string;\n};\n\nexport type Classes = keyof Styles;\n\ndeclare const styles: Styles;\n\nexport default styles;\n"
      );
    });

    it("uses custom value for Styles type name", async () => {
      const definition = await classNamesToTypeDefinitions({
        banner: "",
        classNames: ["myClass", "yourClass"],
        exportType: "default",
        exportTypeInterface: "IStyles",
        file,
      });

      expect(definition).toEqual(
        "export type IStyles = {\n  'myClass': string;\n  'yourClass': string;\n};\n\nexport type ClassNames = keyof IStyles;\n\ndeclare const styles: IStyles;\n\nexport default styles;\n"
      );
    });
  });

  describe("Banner support", () => {
    const firstLine = (str: string): string => str.split(os.EOL)[0];

    it("appends the banner to the top of the output file: default", async () => {
      const banner = "// Example banner";
      const definition = await classNamesToTypeDefinitions({
        banner,
        classNames: ["myClass", "yourClass"],
        exportType: "default",
        file,
      });

      expect(firstLine(definition!)).toBe(banner);
    });

    it("appends the banner to the top of the output file: named", async () => {
      const banner = "// Example banner";
      const definition = await classNamesToTypeDefinitions({
        banner,
        classNames: ["myClass", "yourClass"],
        exportType: "named",
        file,
      });

      expect(firstLine(definition!)).toBe(banner);
    });
  });
});
