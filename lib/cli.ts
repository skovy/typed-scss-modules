#!/usr/bin/env node

import yargs from "yargs";

import { Aliases, NAME_FORMATS, NameFormat } from "./sass";
import { ExportType, EXPORT_TYPES } from "./typescript";
import { main } from "./main";

const nameFormatDefault: NameFormat = "camel";
const exportTypeDefault: ExportType = "named";

const { _: patterns, ...rest } = yargs
  .usage(
    "Generate .scss.d.ts from CSS module .scss files.\nUsage: $0 <glob pattern> [options]"
  )
  .example("$0 src", "All .scss files at any level in the src directoy")
  .example(
    "$0 src/**/*.scss",
    "All .scss files at any level in the src directoy"
  )
  .example(
    "$0 src/**/*.scss --watch",
    "Watch all .scss files at any level in the src directoy that are added or changed"
  )
  .example(
    "$0 src/**/*.scss --includePaths src/core src/variables",
    'Search the "core" and "variables" directory when resolving imports'
  )
  .example(
    "$0 src/**/*.scss --aliases.~name variables",
    'Replace all imports for "~name" with "variables"'
  )
  .example(
    "$0 src/**/*.scss --aliasPrefixes.~ ./node_modules/",
    'Replace the "~" prefix with "./node_modules/" for all imports beginning with "~"'
  )
  .demandCommand(1)
  .option("aliases", {
    coerce: (obj): Aliases => obj,
    alias: "a",
    describe: "Alias any import to any other value."
  })
  .option("aliasPrefixes", {
    coerce: (obj): Aliases => obj,
    alias: "p",
    describe: "A prefix for any import to rewrite to another value."
  })
  .option("nameFormat", {
    choices: NAME_FORMATS,
    default: nameFormatDefault,
    alias: "n",
    describe: "The name format that should be used to transform class names."
  })
  .option("exportType", {
    choices: EXPORT_TYPES,
    default: exportTypeDefault,
    alias: "e",
    describe: "The type of export used for defining the type defintions."
  })
  .option("watch", {
    boolean: true,
    default: false,
    alias: "w",
    describe:
      "Watch for added or changed files and (re-)generate the type definitions."
  })
  .option("ignoreInitial", {
    boolean: true,
    default: false,
    describe: "Skips the initial build when passing the watch flag."
  })
  .option("listDifferent", {
    boolean: true,
    default: false,
    alias: "l",
    describe:
      "List any type definitions that are different than those that would be generated."
  })
  .option("includePaths", {
    array: true,
    string: true,
    alias: "i",
    describe: "Additional paths to include when trying to resolve imports."
  }).argv;

main(patterns[0], { ...rest });
