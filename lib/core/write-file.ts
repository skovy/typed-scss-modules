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
import { removeSCSSTypeDefinitionFile } from "./remove-file";

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

      const typesPath = getTypeDefinitionPath(file, options);
      const typesExist = fs.existsSync(typesPath);

      // Avoid outputting empty type definition files.
      // If the file exists and the type definition is now empty, remove the file.
      if (!typeDefinition) {
        if (typesExist) {
          removeSCSSTypeDefinitionFile(file, options);
        } else {
          alerts.notice(`[NO GENERATED TYPES] ${file}`);
        }
        return;
      }

      // Avoid re-writing the file if it hasn't changed.
      // First by checking the file modification time, then
      // by comparing the file contents.
      if (options.updateStaleOnly && typesExist) {
        const fileModified = fs.statSync(file).mtime;
        const typeDefinitionModified = fs.statSync(typesPath).mtime;

        if (fileModified < typeDefinitionModified) {
          return;
        }

        const existingTypeDefinition = fs.readFileSync(typesPath, "utf8");
        if (existingTypeDefinition === typeDefinition) {
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
