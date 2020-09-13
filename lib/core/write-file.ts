import fs from "fs";
import { SassError } from "node-sass";

import { alerts } from "./alerts";
import {
  getTypeDefinitionPath,
  classNamesToTypeDefinitions
} from "../typescript";
import { fileToClassNames } from "../sass";
import { MainOptions } from "./types";
import { attemptPrettier } from "./attemptPrettier";

/**
 * Given a single file generate the proper types.
 *
 * @param file the SCSS file to generate types for
 * @param options the CLI options
 */
export const writeFile = (
  file: string,
  options: MainOptions
): Promise<void> => {
  return fileToClassNames(file, options)
    .then(classNames => {
      const typeDefinition = classNamesToTypeDefinitions({
        classNames: classNames,
        ...options
      });

      if (!typeDefinition) {
        alerts.notice(`[NO GENERATED TYPES] ${file}`);
        return;
      }

      const path = getTypeDefinitionPath(file);

      return attemptPrettier(typeDefinition).then(output => {
        fs.writeFileSync(path, output);
        alerts.success(`[GENERATED TYPES] ${path}`);
      });
    })
    .catch(({ message, file, line, column }: SassError) => {
      const location = file ? `(${file}[${line}:${column}])` : "";
      alerts.error(`${message} ${location}`);
    });
};
