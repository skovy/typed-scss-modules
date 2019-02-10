import { fileToClassNames } from "../file-to-class-names";

describe("fileToClassNames", () => {
  test("converts a file path to an array of class names", async () => {
    const result = await fileToClassNames(`${__dirname}/style.scss`);
    expect(result).toEqual(["some-styles", "nested-class", "nested-another"]);
  });
});
