import { classNamesToTypeDefinitions } from "../../lib/typescript";

describe("classNamesToTypeDefinitions", () => {
  it("converts an array of class name strings to type definitions", () => {
    const definition = classNamesToTypeDefinitions(["myClass", "yourClass"]);

    expect(definition).toEqual(
      "export const myClass: string;\nexport const yourClass: string;\n"
    );
  });

  it("returns null if there are no class names", () => {
    const definition = classNamesToTypeDefinitions([]);

    expect(definition).toBeNull;
  });
});
