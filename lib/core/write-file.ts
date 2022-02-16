import fs from "fs";
import path from "path";
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

      const typesPath = getTypeDefinitionPath(file, options);

      if (options.updateStaleOnly && fs.existsSync(typesPath)) {
        const fileModified = fs.statSync(file).mtime;
        const typeDefinitionModified = fs.statSync(typesPath).mtime;

        if (fileModified < typeDefinitionModified) {
          return;
        }
      }

      // Files can be written to arbitrary directories and need to
      // be nested to match the project structure so it's possible
      // there are multiple directories that need to be created.
      const dirname = path.dirname(typesPath);
      if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
      }

      fs.writeFileSync(typesPath, typeDefinition);
      alerts.success(`[GENERATED TYPES] ${typesPath}`);
    })
    .catch(({ message, file, line, column }: SassError) => {
      const location = file ? `(${file}[${line}:${column}])` : "";
      alerts.error(`${message} ${location}`);
    });
};
