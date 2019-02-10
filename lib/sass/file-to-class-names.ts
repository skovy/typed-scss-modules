import sass from "node-sass";
import { sourceToClassNames } from "./source-to-class-names";

export type ClassName = string;
export type ClassNames = ClassName[];

export interface Aliases {
  [index: string]: string;
}

export interface Options {
  includePaths?: string[];
  aliases?: Aliases;
}

const importer = (aliases: Aliases) => (url: string) => {
  if (url in aliases) {
    return {
      file: aliases[url]
    };
  }

  return null;
};

export const fileToClassNames = (
  file: string,
  { includePaths = [], aliases = {} }: Options = {}
) => {
  return new Promise<ClassNames>((resolve, reject) => {
    sass.render(
      {
        file,
        includePaths,
        importer: importer(aliases)
      },
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        sourceToClassNames(result.css).then(({ exportTokens }) => {
          resolve(Object.keys(exportTokens));
        });
      }
    );
  });
};
