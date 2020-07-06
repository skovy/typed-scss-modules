import { classNamesToTypeDefinitions, ExportType } from "../../lib/typescript";

describe("classNamesToTypeDefinitions", () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  describe("named", () => {
    it("converts an array of class name strings to type definitions", () => {
      const definition = classNamesToTypeDefinitions({
        classNames: ["myClass", "yourClass"],
        exportType: "named"
      });

      expect(definition).toEqual(
        "export const myClass: string;\nexport const yourClass: string;\n"
      );
    });

    it("returns null if there are no class names", () => {
      const definition = classNamesToTypeDefinitions({
        classNames: [],
        exportType: "named"
      });

      expect(definition).toBeNull;
    });

    it("prints a warning if a classname is a reserved keyword and does not include it in the type definitions", () => {
      const definition = classNamesToTypeDefinitions({
        classNames: ["myClass", "if"],
        exportType: "named"
      });

      expect(definition).toEqual("export const myClass: string;\n");
      expect(console.log).toBeCalledWith(
        expect.stringContaining(`[SKIPPING] 'if' is a reserved keyword`)
      );
    });

    it("prints a warning if a classname is invalid and does not include it in the type definitions", () => {
      const definition = classNamesToTypeDefinitions({
        classNames: ["myClass", "invalid-variable"],
        exportType: "named"
      });

      expect(definition).toEqual("export const myClass: string;\n");
      expect(console.log).toBeCalledWith(
        expect.stringContaining(`[SKIPPING] 'invalid-variable' contains dashes`)
      );
    });
  });

  describe("default", () => {
    it("converts an array of class name strings to type definitions", () => {
      const definition = classNamesToTypeDefinitions({
        classNames: ["myClass", "yourClass"],
        exportType: "default"
      });

      expect(definition).toEqual(
        "export type Styles = {\n  'myClass': string;\n  'yourClass': string;\n}\n\nexport type ClassNames = keyof Styles;\n\ndeclare const styles: Styles;\n\nexport default styles;\n"
      );
    });

    it("returns null if there are no class names", () => {
      const definition = classNamesToTypeDefinitions({
        classNames: [],
        exportType: "default"
      });

      expect(definition).toBeNull;
    });
  });

  describe("invalid export type", () => {
    it("returns null", () => {
      const definition = classNamesToTypeDefinitions({
        classNames: ["myClass"],
        exportType: "invalid" as ExportType
      });

      expect(definition).toBeNull;
    });
  });

  describe("quoteType", () => {
    it("uses double quotes for default exports when specified", () => {
      const definition = classNamesToTypeDefinitions({
        classNames: ["myClass", "yourClass"],
        exportType: "default",
        quoteType: "double"
      });

      expect(definition).toEqual(
        'export type Styles = {\n  "myClass": string;\n  "yourClass": string;\n}\n\nexport type ClassNames = keyof Styles;\n\ndeclare const styles: Styles;\n\nexport default styles;\n'
      );
    });

    it("does not affect named exports", () => {
      const definition = classNamesToTypeDefinitions({
        classNames: ["myClass", "yourClass"],
        exportType: "named",
        quoteType: "double"
      });

      expect(definition).toEqual(
        "export const myClass: string;\nexport const yourClass: string;\n"
      );
    });
  });

  describe("exportType name and type attributes", () => {
    it("uses custom value for ClassNames type name", () => {
      const definition = classNamesToTypeDefinitions({
        classNames: ["myClass", "yourClass"],
        exportType: "default",
        exportTypeName: "Classes"
      });

      expect(definition).toEqual(
        "export type Styles = {\n  'myClass': string;\n  'yourClass': string;\n}\n\nexport type Classes = keyof Styles;\n\ndeclare const styles: Styles;\n\nexport default styles;\n"
      );
    });

    it("uses custom value for Styles type name", () => {
      const definition = classNamesToTypeDefinitions({
        classNames: ["myClass", "yourClass"],
        exportType: "default",
        exportTypeInterface: "IStyles"
      });

      expect(definition).toEqual(
        "export type IStyles = {\n  'myClass': string;\n  'yourClass': string;\n}\n\nexport type ClassNames = keyof IStyles;\n\ndeclare const styles: IStyles;\n\nexport default styles;\n"
      );
    });
  });
});
