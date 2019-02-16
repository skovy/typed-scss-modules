import fs from "fs";
import path from "path";

import { watch, MainOptions, generate } from "./core";

export const main = (pattern: string, options: MainOptions): void => {
  // When the provided pattern is a directory construct the proper glob to find
  // all .scss files within that directory. Also, add the directory to the
  // included paths so any imported with a path relative to the root of the
  // project still works as expected without adding many include paths.
  if (fs.existsSync(pattern) && fs.lstatSync(pattern).isDirectory()) {
    if (Array.isArray(options.includePaths)) {
      options.includePaths.push(pattern);
    } else {
      options.includePaths = [pattern];
    }

    // When the pattern provide is a directory, assume all .scss files within.
    pattern = path.resolve(pattern, "**/*.scss");
  }

  if (options.watch) {
    watch(pattern, options);
  } else {
    generate(pattern, options);
  }
};
