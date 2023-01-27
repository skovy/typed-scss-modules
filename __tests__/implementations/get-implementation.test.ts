import sass from "sass";
import nodeSass from "node-sass";

import { getImplementation } from "../../lib/implementations/index.js";

describe("getImplementation", () => {
  it("returns the correct implementation when explicitly passed", () => {
    expect(getImplementation("node-sass")).toEqual(nodeSass);
    expect(getImplementation("sass")).toEqual(sass);
  });

  it("returns the correct default implementation if it is invalid", () => {
    expect(getImplementation("wat-sass" as any)).toEqual(nodeSass);
    expect(getImplementation()).toEqual(nodeSass);
  });
});
