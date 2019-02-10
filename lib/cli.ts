import yargs from "yargs";

import { parse, Aliases, NAME_FORMATS, NameFormat } from "./sass";

const nameFormatDefault: NameFormat = "camel";

const { _: files, includePaths, aliases, nameFormat } = yargs
  .demandOption("_")
  .option("aliases", { coerce: (obj): Aliases => obj, alias: "a" })
  .option("nameFormat", {
    choices: NAME_FORMATS,
    default: nameFormatDefault,
    alias: "n"
  })
  .option("includePaths", { array: true, string: true }).argv;

parse(files[0], { includePaths, aliases, nameFormat });
