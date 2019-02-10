import { SassError } from "node-sass";

import { Options, fileToClassNames } from "./file-to-class-names";

export const parse = (file: string, options: Options): void => {
  fileToClassNames(file, options)
    .then(console.log)
    .catch((err: SassError) => {
      console.error(err.message);
      console.error(`${err.file}[${err.line}:${err.column}]`);
    });
};
