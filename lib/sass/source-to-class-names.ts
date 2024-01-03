import * as proxy from "identity-obj-proxy";
import postcss from "postcss";
import PostcssModulesPlugin from "postcss-modules";
import { ConfigOptions } from "../core/types";

export type SourceToClassNamesOptions = Pick<ConfigOptions, "modules">;

/**
 * Use identity-obj-proxy for any imported CSS modules
 *
 * This should not affect the final for a given file, since the types are
 * generated only using the classes defined in the current file.
 *
 * This has the added benefit of reducing system calls and disk access,
 * so may perform faster in large projects.
 *
 * The only drawback is that this does not process the import tree
 * the way in which it is intended to be used, so broken imports
 * will not be surfaced by this tool.
 */
class IdentityObjProxyLoader {
  async fetch() {
    return proxy;
  }
}

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
      Loader: IdentityObjProxyLoader,
      getJSON: (_, json) => {
        result = json;
      },
    }),
  ]).process(source, { from: file });
  return Object.keys(result);
};
