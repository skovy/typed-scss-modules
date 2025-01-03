import * as proxy from "identity-obj-proxy";
import postcss from "postcss";
import PostcssModulesPlugin from "postcss-modules";

/**
 * Use identity-obj-proxy for any imported CSS modules. This is to ignore any
 * css module imports via `composes: ` or `@value` statements as the rules to propoerly
 * resolve these requests may be totally arbitrary and different accross projects. Additionally,
 * this is a simple way to avoid needing to write a sass loader for this tool. (To handle import of
 * css modules written in SASS).
 *
 * The identity-obj-proxy is a simple object that returns the requested key as the value.
 *
 * So files with the following request
 *
 * ```css
 * .foo {
 *   composes: bar from "./baz.css";
 * }
 * ```
 *
 * will generate something like
 *
 * ```js
 * {
 *   foo: "foo-HASH123 bar", // the `bar` class is not resolved, and stubbed by the proxy
 * }
 * ```
 *
 * This should not affect the final types for a given file, since the types are
 * generated only using the classes defined in the current file and not its imports.
 *
 * This has the added benefit of reducing system calls and disk access,
 * so may perform faster in large projects in comparison to properly resolving these requests.
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
  file: string
) => {
  let result: Record<string, string> = {};
  await postcss([
    PostcssModulesPlugin({
      Loader: IdentityObjProxyLoader,
      getJSON: (_, json) => {
        result = json;
      },
    }),
  ]).process(source, { from: file });
  return Object.keys(result);
};
