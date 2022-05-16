import fs from "fs";
import { camelCase, paramCase, snakeCase } from "change-case";

import { sourceToClassNames } from "./source-to-class-names";
import { Implementations, getImplementation } from "../implementations";
import { customImporters, Aliases, SASSImporterOptions } from "./importer";

export type ClassName = string;
interface Transformer {
  (className: ClassName): string;
}

const transformersMap = {
  camel: (className: string) => camelCase(className),
  dashes: (className: string) =>
    /-/.test(className) ? camelCase(className) : className,
  kebab: (className: string) => transformersMap.param(className),
  none: (className: string) => className,
  param: (className: string) => paramCase(className),
  snake: (className: string) => snakeCase(className),
} as const;

export type NameFormatInput = keyof typeof transformersMap | "all" | "none";

export const NAME_FORMATS = Object.keys(transformersMap).concat([
  "all",
]) as NameFormatInput[];

type NameFormatsWithTransformer = Exclude<NameFormatInput, "all">;

export interface SASSOptions extends SASSImporterOptions {
  additionalData?: string;
  includePaths?: string[];
  nameFormat?: NameFormatInput[];
  implementation: Implementations;
}
export const nameFormatDefault: NameFormatInput = "camel";

export { Aliases };

export const fileToClassNames = (
  file: string,
  {
    additionalData,
    includePaths = [],
    nameFormat,
    implementation,
    aliases,
    aliasPrefixes,
    importer,
  }: SASSOptions = {} as SASSOptions
) => {
  let nameFormats: NameFormatsWithTransformer[] = [nameFormatDefault];

  if (nameFormat) {
    nameFormats = (
      nameFormat.includes("all")
        ? NAME_FORMATS.filter((item) => item !== "all" && item !== "none")
        : nameFormat
    ) as NameFormatsWithTransformer[];
  }

  const transformers = nameFormats.map((item) => transformersMap[item]);

  const { renderSync } = getImplementation(implementation);

  return new Promise<ClassName[]>((resolve, reject) => {
    try {
      const data = fs.readFileSync(file).toString();
      const result = renderSync({
        file,
        data: additionalData ? `${additionalData}\n${data}` : data,
        includePaths,
        importer: customImporters({ aliases, aliasPrefixes, importer }),
      });

      sourceToClassNames(result.css).then(({ exportTokens }) => {
        const classNames = Object.keys(exportTokens);
        const transformedClassNames = classNames.reduce(
          (output: string[], className: string) => {
            return [
              ...output,
              ...transformers.reduce(
                (transformedClasses: string[], transformer: Transformer) => {
                  const transformedClass = transformer(className);
                  if (
                    output.includes(transformedClass) ||
                    transformedClasses.includes(transformedClass)
                  ) {
                    return transformedClasses;
                  }

                  return [...transformedClasses, transformedClass];
                },
                []
              ),
            ];
          },
          []
        );

        transformedClassNames.sort((a, b) => a.localeCompare(b));

        resolve(transformedClassNames);
      });
    } catch (err) {
      reject(err);
      return;
    }
  });
};
