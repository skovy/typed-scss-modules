import glob from "glob";
import fs from "fs";

import { alerts } from "./alerts";
import { MainOptions } from "./types";
import { fileToClassNames } from "../sass";
import {
  classNamesToTypeDefinitions,
  getTypeDefinitionPath
} from "../typescript";

export const listDifferent = async (
  pattern: string,
  options: MainOptions
): Promise<void> => {
  // Find all the files that match the provied pattern.
  const files = glob.sync(pattern);

  if (!files || !files.length) {
    alerts.notice("No files found.");
    return;
  }

  // Wait for all the files to be checked.
  await Promise.all(files.map(file => checkFile(file, options))).then(
    results => {
      results.includes(false) && process.exit(1);
    }
  );
};

export const checkFile = (
  file: string,
  options: MainOptions
): Promise<boolean> => {
  return new Promise(resolve =>
    fileToClassNames(file, options).then(classNames => {
      const typeDefinition = classNamesToTypeDefinitions({
        classNames: classNames,
        ...options
      });

      if (!typeDefinition) {
        // Assume if no type defs are necessary it's fine
        resolve(true);
        return;
      }

      const path = getTypeDefinitionPath(file);

      const content = fs.readFileSync(path, { encoding: "UTF8" });

      if (content === typeDefinition) {
        resolve(true);
      } else {
        alerts.error(`[INVALID TYPES] Check type definitions for ${file}`);
        resolve(false);
      }
    })
  );
};
