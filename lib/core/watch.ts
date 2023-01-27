import chokidar from "chokidar";

import { alerts } from "./alerts.js";
import { removeSCSSTypeDefinitionFile } from "./remove-file.js";
import { writeFile } from "./write-file.js";
import { ConfigOptions } from "./types.js";
import { listFilesAndPerformSanityChecks } from "./list-files-and-perform-sanity-checks.js";

/**
 * Watch a file glob and generate the corresponding types.
 *
 * @param pattern the file pattern to watch for file changes or additions
 * @param options the CLI options
 */
export const watch = (pattern: string, options: ConfigOptions): void => {
  listFilesAndPerformSanityChecks(pattern, options);

  alerts.success("Watching files...");

  chokidar
    .watch(pattern, {
      ignoreInitial: options.ignoreInitial,
      ignored: options.ignore,
    })
    .on("change", (path) => {
      alerts.info(`[CHANGED] ${path}`);
      writeFile(path, options);
    })
    .on("add", (path) => {
      alerts.info(`[ADDED] ${path}`);
      writeFile(path, options);
    })
    .on("unlink", (path) => {
      alerts.info(`[REMOVED] ${path}`);
      removeSCSSTypeDefinitionFile(path, options);
    });
};
