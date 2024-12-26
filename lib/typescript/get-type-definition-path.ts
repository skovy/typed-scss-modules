import path from "path";
import { ConfigOptions } from "../core";

const CURRENT_WORKING_DIRECTORY = process.cwd();

/**
 * Given a file path to a SCSS file, generate the corresponding type definition
 * file path.
 *
 * @param file the SCSS file path
 */
export const getTypeDefinitionPath = (
  file: string,
  options: ConfigOptions
): string => {
  let resolvedPath = file;

  if (options.outputFolder) {
    const relativePath = path.relative(CURRENT_WORKING_DIRECTORY, file);
    resolvedPath = path.resolve(
      CURRENT_WORKING_DIRECTORY,
      options.outputFolder,
      relativePath
    );
  }

  if (options.allowArbitraryExtensions) {
    const resolvedDirname = path.dirname(resolvedPath);
    // Note: `ext` includes a leading period (e.g. '.scss')
    const { name, ext } = path.parse(resolvedPath);
    // @see https://www.typescriptlang.org/tsconfig/#allowArbitraryExtensions
    return path.join(resolvedDirname, `${name}.d${ext}.ts`);
  } else {
    return `${resolvedPath}.d.ts`;
  }
};
