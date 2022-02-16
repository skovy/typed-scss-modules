import { ConfigOptions } from "../../lib/core";
import { getTypeDefinitionPath } from "../../lib/typescript";

describe("getTypeDefinitionPath", () => {
  it("returns the type definition path", () => {
    const path = getTypeDefinitionPath(
      "/some/path/style.scss",
      {} as ConfigOptions
    );

    expect(path).toEqual("/some/path/style.scss.d.ts");
  });
});
