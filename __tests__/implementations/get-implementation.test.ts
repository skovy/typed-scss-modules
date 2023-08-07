import nodeSass from "node-sass";
import sass from "sass";
import { getImplementation } from "../../lib/implementations";

describe("getImplementation", () => {
  it("returns the correct implementation when explicitly passed", () => {
    expect(getImplementation("node-sass")).toEqual(nodeSass);
    expect(getImplementation("sass")).toEqual(sass);
  });

  it("returns the correct default implementation if it is invalid", () => {
    expect(
      getImplementation(
        // @ts-expect-error invalid implementation
        "wat-sass"
      )
    ).toEqual(nodeSass);
    expect(getImplementation()).toEqual(nodeSass);
  });
});
