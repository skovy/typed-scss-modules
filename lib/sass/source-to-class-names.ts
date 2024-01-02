import postcss from "postcss";
import PostcssModulesPlugin from "postcss-modules";
import { ConfigOptions } from "../core/types";

/**
 * Converts a CSS source string to a list of exports (class names, keyframes, etc.)
 */
export const sourceToClassNames = async (
  source: { toString(): string },
  file: string,
  { modules = {} }: ConfigOptions = {} as ConfigOptions
) => {
  let result: Record<string, string> = {};
  await postcss([
    PostcssModulesPlugin({
      ...modules,
      getJSON: (_, json) => {
        result = json;
      },
    }),
  ]).process(source, { from: file });
  return Object.keys(result);
};
