#!/usr/bin/env node

import yargs from "yargs";

import { Aliases, NAME_FORMATS, NameFormat } from "./sass";
import { main } from "./main";

const nameFormatDefault: NameFormat = "camel";

const { _: patterns, includePaths, aliases, nameFormat } = yargs
  .usage(
    "Generate .scss.d.ts from CSS module .scss files.\nUsage: $0 <glob pattern> [options]"
  )
  .example("$0 src", "All .scss files at any level in the src directoy")
  .example(
    "$0 src/**/*.scss",
    "All .scss files at any level in the src directoy"
  )
  .example(
    "$0 src/**/*.scss --includePaths src/core src/variables",
    'Search the "core" and "variables" directory when resolving imports'
  )
  .example(
    "$0 src/**/*.scss --aliases.~name variables",
    'Replace all imports for "~name" with "variables"'
  )
  .demandCommand(1)
  .option("aliases", {
    coerce: (obj): Aliases => obj,
    alias: "a",
    describe: "Alias any import to any other value."
  })
  .option("nameFormat", {
    choices: NAME_FORMATS,
    default: nameFormatDefault,
    alias: "n",
    describe: "The name format that should be used to transform class names."
  })
  .option("includePaths", {
    array: true,
    string: true,
    describe: "Additional paths to include when trying to resolve imports."
  }).argv;

main(patterns[0], { includePaths, aliases, nameFormat });
