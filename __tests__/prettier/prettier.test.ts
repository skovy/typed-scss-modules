import prettier from "prettier";
import { attemptPrettier } from "../../lib/prettier";
import { classNamesToTypeDefinitions } from "../../lib/typescript";

const input =
  "export type Styles = {'myClass': string;'yourClass': string;}; export type Classes = keyof Styles; declare const styles: Styles; export default styles;";

describe("attemptPrettier", () => {
  it("should locate and apply prettier.format", async () => {
    const output = await attemptPrettier(input);

    expect(prettier.format(input, { parser: "typescript" })).toMatch(output);
  });

  it("should match snapshot", async () => {
    const typeDefinition = await classNamesToTypeDefinitions({
      banner: "",
      classNames: ["nestedAnother", "nestedClass", "someStyles"],
      exportType: "default",
    });

    if (!typeDefinition) {
      throw new Error("failed to collect typeDefinition");
    }

    const output = await attemptPrettier(typeDefinition);

    expect(output).toMatchSnapshot();
  });
});

describe("attemptPrettier - mock prettier", () => {
  beforeAll(() => {
    jest.mock("prettier", () => ({
      format: undefined,
    }));
  });

  it("should fail to recognize prettier and return input", async () => {
    const output = await attemptPrettier(input);

    expect(input).toMatch(output);
  });
});

describe("attemptPrettier - mock resolution check", () => {
  beforeAll(() => {
    jest.mock("../../lib/prettier/can-resolve");
  });

  it("should fail to resolve prettier and return input", async () => {
    const output = await attemptPrettier(input);

    expect(input).toMatch(output);
  });
});
