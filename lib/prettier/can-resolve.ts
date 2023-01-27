// this is only extracted to a module to mock in testing as require.resolve can't be mocked.
// https://github.com/facebook/jest/issues/9543

import { createRequire } from "node:module";

export function canResolvePrettier() {
  try {
    const newRequire = createRequire(import.meta.url);
    newRequire.resolve("prettier");
    return true;
  } catch (_error) {
    // cannot resolve prettier
    return false;
  }
}
