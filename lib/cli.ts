import yargs from "yargs";
import { SassError } from "node-sass";

import { fileToClassNames, Aliases } from "./sass/file-to-class-names";

const { _: files, includePaths, aliases } = yargs
  .demandOption("_")
  .option("aliases", { coerce: (obj): Aliases => obj })
  .option("includePaths", { array: true, string: true }).argv;

fileToClassNames(files[0], { includePaths, aliases })
  .then(console.log)
  .catch((err: SassError) => {
    console.error(err.message);
    console.error(`${err.file}[${err.line}:${err.column}]`);
  });
