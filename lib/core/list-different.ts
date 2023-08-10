import fs from "fs";
import { fileToClassNames } from "../sass/index.js";
import {
  classNamesToTypeDefinitions,
  getTypeDefinitionPath,
} from "../typescript/index.js";
import { alerts } from "./alerts.js";
import { listFilesAndPerformSanityChecks } from "./list-files-and-perform-sanity-checks.js";
import { ConfigOptions } from "./types.js";

export const listDifferent = async (
  pattern: string,
  options: ConfigOptions,
): Promise<void> => {
  const files = listFilesAndPerformSanityChecks(pattern, options);

  // Wait for all the files to be checked.
  const validChecks = await Promise.all(
    files.map((file) => checkFile(file, options)),
  );
  if (validChecks.includes(false)) {
    process.exit(1);
  }
};

export const checkFile = async (
  file: string,
  options: ConfigOptions,
): Promise<boolean> => {
  try {
    const classNames = await fileToClassNames(file, options);
    const typeDefinition = await classNamesToTypeDefinitions({
      classNames: classNames,
      ...options,
    });

    if (!typeDefinition) {
      // Assume if no type defs are necessary it's fine
      return true;
    }

    const path = getTypeDefinitionPath(file, options);
    if (!fs.existsSync(path)) {
      alerts.error(
        `[INVALID TYPES] Type file needs to be generated for ${file} `,
      );
      return false;
    }

    const content = fs.readFileSync(path, { encoding: "utf8" });
    if (content !== typeDefinition) {
      alerts.error(`[INVALID TYPES] Check type definitions for ${file}`);
      return false;
    }

    return true;
  } catch (error) {
    alerts.error(
      `An error occurred checking ${file}:\n${JSON.stringify(error)}`,
    );
    return false;
  }
};
