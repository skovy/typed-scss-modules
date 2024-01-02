import postcss from "postcss";
import PostcssModulesPlugin from "postcss-modules";
import { ConfigOptions } from "../core/types";

export type SourceToClassNamesOptions = Pick<ConfigOptions, "modules">;

/**
 * Converts a CSS source string to a list of exports (class names, keyframes, etc.)
 */
export const sourceToClassNames = async (
  source: { toString(): string },
  file: string,
  { modules = {} }: SourceToClassNamesOptions = {} as SourceToClassNamesOptions
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
