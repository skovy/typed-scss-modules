import camelcase from "camelcase";
import { paramCase } from "param-case";

import { sourceToClassNames } from "./source-to-class-names";
import { Implementations, getImplementation } from "../implementations";
import { customImporters, Aliases, SASSImporterOptions } from "./importer";

export type ClassName = string;
export type ClassNames = ClassName[];

export type NameFormat = "camel" | "kebab" | "param" | "dashes" | "none";

export interface SASSOptions extends SASSImporterOptions {
  includePaths?: string[];
  nameFormat?: NameFormat;
  implementation: Implementations;
}

export const NAME_FORMATS: NameFormat[] = [
  "camel",
  "kebab",
  "param",
  "dashes",
  "none",
];

export const nameFormatDefault: NameFormat = "camel";

export { Aliases };

export const fileToClassNames = (
  file: string,
  {
    includePaths = [],
    nameFormat = "camel",
    implementation,
    aliases,
    aliasPrefixes,
    importer,
  }: SASSOptions = {} as SASSOptions
) => {
  const transformer = classNameTransformer(nameFormat);
  const { renderSync } = getImplementation(implementation);

  return new Promise<ClassNames>((resolve, reject) => {
    try {
      const result = renderSync({
        file,
        includePaths,
        importer: customImporters({ aliases, aliasPrefixes, importer }),
      });

      sourceToClassNames(result.css).then(({ exportTokens }) => {
        const classNames = Object.keys(exportTokens);
        const transformedClassNames = classNames
          .map(transformer)
          .sort((a, b) => a.localeCompare(b));

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
      return (className) => paramCase(className);
    case "camel":
      return (className) => camelcase(className);
    case "dashes":
      return (className) =>
        /-/.test(className) ? camelcase(className) : className;
    case "none":
      return (className) => className;
  }
};
