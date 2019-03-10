import sass from "node-sass";
import camelcase from "camelcase";
import paramcase from "param-case";

import { sourceToClassNames } from "./source-to-class-names";

export type ClassName = string;
export type ClassNames = ClassName[];

export interface Aliases {
  [index: string]: string;
}

export type NameFormat = "camel" | "kebab" | "param" | "dashes" | "none";

export interface Options {
  includePaths?: string[];
  aliases?: Aliases;
  aliasPrefixes?: Aliases;
  nameFormat?: NameFormat;
}

export const NAME_FORMATS: NameFormat[] = [
  "camel",
  "kebab",
  "param",
  "dashes",
  "none"
];

const importer = (aliases: Aliases, aliasPrefixes: Aliases) => (
  url: string
) => {
  if (url in aliases) {
    return {
      file: aliases[url]
    };
  }

  const prefixMatch = Object.keys(aliasPrefixes).find(prefix =>
    url.startsWith(prefix)
  );
  if (prefixMatch) {
    return {
      file: aliasPrefixes[prefixMatch] + url.substr(prefixMatch.length)
    };
  }

  return null;
};

export const fileToClassNames = (
  file: string,
  {
    includePaths = [],
    aliases = {},
    aliasPrefixes = {},
    nameFormat = "camel"
  }: Options = {} as Options
) => {
  const transformer = classNameTransformer(nameFormat);

  return new Promise<ClassNames>((resolve, reject) => {
    sass.render(
      {
        file,
        includePaths,
        importer: importer(aliases, aliasPrefixes)
      },
      (err, result) => {
        if (err) {
          reject(err);
          return;
        }

        sourceToClassNames(result.css).then(({ exportTokens }) => {
          const classNames = Object.keys(exportTokens);
          const transformedClassNames = classNames.map(transformer);

          resolve(transformedClassNames);
        });
      }
    );
  });
};

interface Transformer {
  (className: string): string;
}

const classNameTransformer = (nameFormat: NameFormat): Transformer => {
  switch (nameFormat) {
    case "kebab":
    case "param":
      return className => paramcase(className);
    case "camel":
      return className => camelcase(className);
    case "dashes":
      return className =>
        /-/.test(className) ? camelcase(className) : className;
    case "none":
      return className => className;
  }
};
