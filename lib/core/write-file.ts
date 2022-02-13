import fs from "fs";
import { SassError } from "node-sass";

import { alerts } from "./alerts";
import {
  getTypeDefinitionPath,
  classNamesToTypeDefinitions,
} from "../typescript";
import { fileToClassNames } from "../sass";
import { CLIOptions } from "./types";

/**
 * Given a single file generate the proper types.
 *
 * @param file the SCSS file to generate types for
 * @param options the CLI options
 */
export const writeFile = (file: string, options: CLIOptions): Promise<void> => {
  return fileToClassNames(file, options)
    .then(async (classNames) => {
      const typeDefinition = await classNamesToTypeDefinitions({
        classNames,
        ...options,
      });

      if (!typeDefinition) {
        alerts.notice(`[NO GENERATED TYPES] ${file}`);
        return;
      }

      const path = getTypeDefinitionPath(file);

      if (options.updateStaleOnly && fs.existsSync(path)) {
        const fileModified = fs.statSync(file).mtime;
        const typeDefinitionModified = fs.statSync(path).mtime;

        if (fileModified < typeDefinitionModified) {
          return;
        }
      }

      fs.writeFileSync(path, typeDefinition);
      alerts.success(`[GENERATED TYPES] ${path}`);
    })
    .catch(({ message, file, line, column }: SassError) => {
      const location = file ? `(${file}[${line}:${column}])` : "";
      alerts.error(`${message} ${location}`);
    });
};
