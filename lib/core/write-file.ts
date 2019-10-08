import { writeFile as nodeWriteFile } from "fs";
import { promisify } from "util";
import { SassError } from "node-sass";

import { alerts } from "./alerts";
import {
  getTypeDefinitionPath,
  classNamesToTypeDefinitions
} from "../typescript";
import { fileToClassNames } from "../sass";
import { MainOptions } from "./types";

const writeFileAsync = promisify(nodeWriteFile);

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
  const alert = alerts(options);
  return fileToClassNames(file, options)
    .then(async classNames => {
      const typeDefinition = classNamesToTypeDefinitions(classNames, options);

      if (!typeDefinition) {
        alert.notice(`[NO GENERATED TYPES] ${file}`);
        return;
      }

      const path = getTypeDefinitionPath(file);
      await writeFileAsync(path, typeDefinition);
      return path;
    })
    .then(path => alert.success(`[GENERATED TYPES] ${path}`))
    .catch(({ message, file, line, column }: SassError) => {
      const location = file ? `(${file}[${line}:${column}])` : "";
      alert.error(`${message} ${location}`);
    });
};
