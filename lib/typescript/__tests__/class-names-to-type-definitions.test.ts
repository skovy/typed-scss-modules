import { classNamesToTypeDefinitions } from "../class-names-to-type-definition";

describe("classNamesToTypeDefinitions", () => {
  it("converts an array of class name strings to type definitions", () => {
    const definition = classNamesToTypeDefinitions(["myClass", "yourClass"]);

    expect(definition).toEqual(
      "export const myClass: string;\nexport const yourClass: string;"
    );
  });
});
