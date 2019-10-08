import chokidar from "chokidar";

import { alerts } from "./alerts";
import { writeFile } from "./write-file";
import { MainOptions } from "./types";

/**
 * Watch a file glob and generate the corresponding types.
 *
 * @param pattern the file pattern to watch for file changes or additions
 * @param options the CLI options
 */
export const watch = (pattern: string, options: MainOptions): void => {
  const alert = alerts(options);
  alert.success("Watching files...");

  chokidar
    .watch(pattern, {
      ignoreInitial: options.ignoreInitial
    })
    .on("change", path => {
      alert.info(`[CHANGED] ${path}`);
      // this is a timeout to ensure files are readable most of the time
      setTimeout(() => {
        writeFile(path, options);
      }, options.watchTimeout);
    })
    .on("add", path => {
      alert.info(`[ADDED] ${path}`);
      // this is a timeout to ensure files are readable most of the time
      setTimeout(() => {
        writeFile(path, options);
      }, options.watchTimeout);
    });
};
