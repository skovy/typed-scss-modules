import nodeSass from "node-sass";
import sass from "sass";

/**
 * A list of all possible SASS package implementations that can be used to
 * perform the compilation and parsing of the SASS files. The expectation is
 * that they provide a nearly identical API so they can be swapped out but
 * all of the same logic can be reused.
 */
export const IMPLEMENTATIONS = ["node-sass", "sass"] as const;
export type Implementations = (typeof IMPLEMENTATIONS)[number];

type Implementation = typeof nodeSass | typeof sass;

/**
 * Determine which default implementation to use by checking which packages
 * are actually installed and available to use.
 *
 * @param resolver DO NOT USE - this is unfortunately necessary only for testing.
 */
export const getDefaultImplementation = (
  resolver: RequireResolve = require.resolve
): Implementations => {
  let pkg: Implementations = "node-sass";

  try {
    resolver("node-sass");
  } catch (error) {
    try {
      resolver("sass");
      pkg = "sass";
    } catch (ignoreError) {
      pkg = "node-sass";
    }
  }

  return pkg;
};

/**
 * Retrieve the desired implementation.
 *
 * @param implementation the desired implementation.
 */
export const getImplementation = (
  implementation?: Implementations
): Implementation => {
  if (implementation === "sass") {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return require("sass");
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return require("node-sass");
  }
};
