import { getDefaultImplementation } from "../../lib/implementations";

describe("getDefaultImplementation", () => {
  it("returns node-sass if it exists", () => {
    expect(getDefaultImplementation()).toBe("node-sass");
  });

  it("returns sass if node-sass does not exist", () => {
    const resolver = (jest.fn((implementation) => {
      if (implementation === "node-sass") {
        throw new Error("Not Found");
      }
    }) as unknown) as RequireResolve;

    expect(getDefaultImplementation(resolver)).toBe("sass");
    expect(resolver).toHaveBeenCalledTimes(2);
    expect(resolver).toHaveBeenNthCalledWith(1, "node-sass");
    expect(resolver).toHaveBeenNthCalledWith(2, "sass");
  });

  it("returns node-sass even if both sass and node-sass do not exist", () => {
    const resolver = (jest.fn(() => {
      throw new Error("Not Found");
    }) as unknown) as RequireResolve;

    expect(getDefaultImplementation(resolver)).toBe("node-sass");
    expect(resolver).toHaveBeenCalledTimes(2);
    expect(resolver).toHaveBeenNthCalledWith(1, "node-sass");
    expect(resolver).toHaveBeenNthCalledWith(2, "sass");
  });
});
