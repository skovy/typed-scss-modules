import { SassError } from "node-sass";
import fs from "fs";
import path from "path";
import glob from "glob";
import chalk from "chalk";
import chokidar from "chokidar";

import { Options, fileToClassNames } from "./sass";
import {
  classNamesToTypeDefinitions,
  ExportType,
  getTypeDefinitionPath
} from "./typescript";

interface MainOptions extends Options {
  exportType: ExportType;
  watch: boolean;
}

const error = (message: string) => console.log(chalk.red(`[ERROR] ${message}`));
const warn = (message: string) => console.log(chalk.yellowBright(`${message}`));
const notice = (message: string) => console.log(chalk.gray(`${message}`));
const info = (message: string) => console.log(chalk.blueBright(`${message}`));
const success = (message: string) => console.log(chalk.green(message));

export const main = (pattern: string, options: MainOptions): void => {
  // When the provided pattern is a directory construct the proper glob to find
  // all .scss files within that directory. Also, add the directory to the
  // included paths so any imported with a path relative to the root of the
  // project still works as expected without adding many include paths.
  if (fs.existsSync(pattern) && fs.lstatSync(pattern).isDirectory()) {
    if (Array.isArray(options.includePaths)) {
      options.includePaths.push(pattern);
    } else {
      options.includePaths = [pattern];
    }

    // When the pattern provide is a directory, assume all .scss files within.
    pattern = path.resolve(pattern, "**/*.scss");
  }

  if (options.watch) {
    watch(pattern, options);
  } else {
    generate(pattern, options);
  }
};

/**
 * Watch a file glob and generate the corresponding types.
 *
 * @param pattern the file pattern to watch for file changes or additions
 * @param options the CLI options
 */
const watch = (pattern: string, options: MainOptions): void => {
  success("Watching files...");

  chokidar
    .watch(pattern)
    .on("change", path => {
      info(`[CHANGED] ${path}`);
      writeFile(path, options);
    })
    .on("add", path => {
      info(`[ADDED] ${path}`);
      writeFile(path, options);
    });
};

/**
 * Given a file glob generate the corresponding types once.
 *
 * @param pattern the file pattern to generate type definitions for
 * @param options the CLI options
 */
const generate = (pattern: string, options: MainOptions): void => {
  // Find all the files that match the provied pattern.
  const files = glob.sync(pattern);

  if (!files || !files.length) {
    error("No files found.");
    return;
  }

  // This case still works as expected but it's easy to do on accident so
  // provide a (hopefully) helpful warning.
  if (files.length === 1) {
    warn(
      'Only 1 file found. If using a glob pattern (eg: dir/**/*.scss) make sure to wrap in quotes (eg: "dir/**/*.scss").'
    );
  }

  success(`Found ${files.length} files. Generating type defintions...`);

  files.map(file => writeFile(file, options));
};

/**
 * Given a single file generate the proper types.
 *
 * @param file the SCSS file to generate types for
 * @param options the CLI options
 */
const writeFile = (file: string, options: MainOptions): void => {
  fileToClassNames(file, options)
    .then(classNames => {
      const typeDefinition = classNamesToTypeDefinitions(
        classNames,
        options.exportType
      );

      if (!typeDefinition) {
        notice(`[NO GENERATED TYPES] ${file}`);
        return null;
      }

      const path = getTypeDefinitionPath(file);

      fs.writeFileSync(path, typeDefinition);
      success(`[GENERATED TYPES] ${path}`);
    })
    .catch(({ message, file, line, column }: SassError) => {
      const location = file ? `(${file}[${line}:${column}])` : "";
      error(`${message} ${location}`);
    });
};
