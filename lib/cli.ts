import yargs from "yargs";

import { Aliases, NAME_FORMATS, NameFormat } from "./sass";
import { main } from "./main";

const nameFormatDefault: NameFormat = "camel";

const { _: patterns, includePaths, aliases, nameFormat } = yargs
  .demandOption("_")
  .option("aliases", { coerce: (obj): Aliases => obj, alias: "a" })
  .option("nameFormat", {
    choices: NAME_FORMATS,
    default: nameFormatDefault,
    alias: "n"
  })
  .option("includePaths", { array: true, string: true }).argv;

main(patterns[0], { includePaths, aliases, nameFormat });
