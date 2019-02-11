import { SassError } from "node-sass";
import fs from "fs";
import path from "path";
import glob from "glob";
import chalk from "chalk";

import { Options, fileToClassNames } from "./sass";
import { classNamesToTypeDefinitions } from "./typescript";

const error = (message: string) => console.log(chalk.red(`[ERROR] ${message}`));
const notice = (message: string) => console.log(chalk.gray(`${message}`));
const success = (message: string) => console.log(chalk.green(message));

export const main = (pattern: string, options: Options): void => {
  const files = glob.sync(pattern);

  if (!files || !files.length) {
    error("No files found.");
    return;
  }

  if (files.length === 1) {
    notice(
      'Only 1 file found. If using a glob pattern (eg: dir/**/*.scss) make sure to wrap in quotes (eg: "dir/**/*.scss").'
    );
  }

  success(`Found ${files.length} files. Generating type defintions...`);

  for (let index in files) {
    const file = files[index];

    fileToClassNames(file, options)
      .then(classNames => {
        const typeDefinition = classNamesToTypeDefinitions(classNames);
        const path = `${file}.d.ts`;

        if (!typeDefinition) {
          notice(`No types generated for ${file}`);
          return null;
        }

        fs.writeFileSync(path, typeDefinition);
        success(`Generated type defintions: ${path}`);
      })
      .catch(({ message, file, line, column }: SassError) => {
        const location = file ? `(${file}[${line}:${column}])` : "";
        error(`${message} ${location}`);
      });
  }
};
