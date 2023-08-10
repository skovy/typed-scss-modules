import { alerts } from "./alerts.js";
import { listFilesAndPerformSanityChecks } from "./list-files-and-perform-sanity-checks.js";
import { ConfigOptions } from "./types.js";
import { writeFile } from "./write-file.js";

/**
 * Given a file glob generate the corresponding types once.
 *
 * @param pattern the file pattern to generate type definitions for
 * @param options the CLI options
 */
export const generate = async (
  pattern: string,
  options: ConfigOptions,
): Promise<void> => {
  const files = listFilesAndPerformSanityChecks(pattern, options);

  if (files.length === 0) {
    return;
  }

  alerts.success(
    `Found ${files.length} file${
      files.length === 1 ? `` : `s`
    }. Generating type definitions...`,
  );

  // Wait for all the type definitions to be written.
  await Promise.all(files.map((file) => writeFile(file, options)));
};
