import camelcase from "camelcase";
import { paramCase } from "param-case";

import { sourceToClassNames } from "./source-to-class-names";
import { Implementations, getImplementation } from "../implementations";

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
  implementation: Implementations;
  sortClassNames?: boolean;
}

export const NAME_FORMATS: NameFormat[] = [
  "camel",
  "kebab",
  "param",
  "dashes",
  "none"
];

export const nameFormatDefault: NameFormat = "camel";

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
    nameFormat = "camel",
    implementation,
    sortClassNames = false
  }: Options = {} as Options
) => {
  const transformer = classNameTransformer(nameFormat);
  const { renderSync } = getImplementation(implementation);

  return new Promise<ClassNames>((resolve, reject) => {
    try {
      const result = renderSync({
        file,
        includePaths,
        importer: importer(aliases, aliasPrefixes)
      });

      sourceToClassNames(result.css).then(({ exportTokens }) => {
        const classNames = Object.keys(exportTokens);
        const transformedClassNames = classNames.map(transformer);

        if (sortClassNames) {
          transformedClassNames.sort((a, b) => a.localeCompare(b));
        }

        resolve(transformedClassNames);
      });
    } catch (err) {
      reject(err);
      return;
    }
  });
};

interface Transformer {
  (className: string): string;
}

const classNameTransformer = (nameFormat: NameFormat): Transformer => {
  switch (nameFormat) {
    case "kebab":
    case "param":
      return className => paramCase(className);
    case "camel":
      return className => camelcase(className);
    case "dashes":
      return className =>
        /-/.test(className) ? camelcase(className) : className;
    case "none":
      return className => className;
  }
};
