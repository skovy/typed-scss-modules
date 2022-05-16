import fs from "fs";
import { camelCase, paramCase, snakeCase } from "change-case";

import { sourceToClassNames } from "./source-to-class-names";
import { Implementations, getImplementation } from "../implementations";
import { customImporters, Aliases, SASSImporterOptions } from "./importer";

export { Aliases };
export type ClassName = string;
interface Transformer {
  (className: ClassName): string;
}

const transformersMap = {
  camel: (className: ClassName) => camelCase(className),
  dashes: (className: ClassName) =>
    /-/.test(className) ? camelCase(className) : className,
  kebab: (className: ClassName) => transformersMap.param(className),
  none: (className: ClassName) => className,
  param: (className: ClassName) => paramCase(className),
  snake: (className: ClassName) => snakeCase(className),
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

export const fileToClassNames = async (
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
  const { renderSync } = getImplementation(implementation);

  let nameFormats: NameFormatsWithTransformer[] = nameFormat
    ? ((nameFormat.includes("all")
        ? NAME_FORMATS.filter((item) => item !== "all")
        : nameFormat) as NameFormatsWithTransformer[])
    : [nameFormatDefault];

  const data = fs.readFileSync(file).toString();
  const result = renderSync({
    file,
    data: additionalData ? `${additionalData}\n${data}` : data,
    includePaths,
    importer: customImporters({ aliases, aliasPrefixes, importer }),
  });

  const { exportTokens } = await sourceToClassNames(result.css);

  const classNames = Object.keys(exportTokens);
  const transformers = nameFormats.map((item) => transformersMap[item]);
  const transformedClassNames = new Set<ClassName>([]);
  classNames.forEach((className: ClassName) => {
    transformers.forEach((transformer: Transformer) => {
      transformedClassNames.add(transformer(className));
    });
  });

  return Array.from(transformedClassNames).sort((a, b) => a.localeCompare(b));
};
