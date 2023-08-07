import fs from "fs";
import { fileToClassNames } from "../sass";
import {
  classNamesToTypeDefinitions,
  getTypeDefinitionPath,
} from "../typescript";
import { alerts } from "./alerts";
import { listFilesAndPerformSanityChecks } from "./list-files-and-perform-sanity-checks";
import { ConfigOptions } from "./types";

export const listDifferent = async (
  pattern: string,
  options: ConfigOptions
): Promise<void> => {
  const files = listFilesAndPerformSanityChecks(pattern, options);

  // Wait for all the files to be checked.
  await Promise.all(files.map((file) => checkFile(file, options))).then(
    (results) => {
      results.includes(false) && process.exit(1);
    }
  );
};

export const checkFile = (
  file: string,
  options: ConfigOptions
): Promise<boolean> => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return new Promise((resolve) =>
    fileToClassNames(file, options)
      .then(async (classNames) => {
        const typeDefinition = await classNamesToTypeDefinitions({
          classNames: classNames,
          ...options,
        });

        if (!typeDefinition) {
          // Assume if no type defs are necessary it's fine
          resolve(true);
          return;
        }

        const path = getTypeDefinitionPath(file, options);

        if (!fs.existsSync(path)) {
          alerts.error(
            `[INVALID TYPES] Type file needs to be generated for ${file} `
          );
          resolve(false);
          return;
        }

        const content = fs.readFileSync(path, { encoding: "utf8" });

        if (content !== typeDefinition) {
          alerts.error(`[INVALID TYPES] Check type definitions for ${file}`);
          resolve(false);
          return;
        }

        resolve(true);
      })
      .catch((error) => {
        alerts.error(
          `An error occurred checking ${file}:\n${JSON.stringify(error)}`
        );
        resolve(false);
      })
  );
};
