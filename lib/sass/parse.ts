import { SassError } from "node-sass";
import fs from "fs";

import { Options, fileToClassNames } from "./file-to-class-names";
import { classNamesToTypeDefinitions } from "../typescript/class-names-to-type-definition";

export const parse = (file: string, options: Options): void => {
  fileToClassNames(file, options)
    .then(classNames => {
      const typeDefinition = classNamesToTypeDefinitions(classNames);
      const path = `${file}.d.ts`;

      console.log(path, typeDefinition);

      fs.writeFileSync(path, typeDefinition)
    })
    .catch((err: SassError) => {
      console.error(err.message);
      console.error(`${err.file}[${err.line}:${err.column}]`);
    });
};
