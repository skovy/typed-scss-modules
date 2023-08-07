import { format, resolveConfig } from "prettier";
import { alerts } from "../core";
import { canResolvePrettier } from "./can-resolve";

interface Prettier {
  format: typeof format;
  resolveConfig: typeof resolveConfig;
}

const isPrettier = (t: unknown): t is Prettier =>
  !!t &&
  typeof t === "object" &&
  t !== null &&
  "format" in t &&
  typeof (t as Prettier).format === "function" &&
  "resolveConfig" in t &&
  typeof (t as Prettier).resolveConfig === "function";

/**
 * Try to load prettier and config from project to format input,
 * fall back to input if prettier is not found or failed
 *
 * @param {string} input
 */
export const attemptPrettier = async (input: string) => {
  if (!canResolvePrettier()) {
    return input;
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const prettier = require("prettier");
  if (!isPrettier(prettier)) {
    // doesn't look like prettier
    return input;
  }

  try {
    const config = await prettier.resolveConfig(process.cwd(), {
      editorconfig: true,
    });
    // try to return formatted output
    return prettier.format(input, { ...config, parser: "typescript" });
  } catch (error) {
    alerts.notice(`Tried using prettier, but failed with error: ${error}`);
  }

  // failed to format
  return input;
};
