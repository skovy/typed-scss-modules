import {
  camelCase,
  camelCaseTransformMerge,
  paramCase,
  snakeCase,
} from "change-case";
import fs from "fs";
import { ConfigOptions } from "../core/types";
import { Implementations, getImplementation } from "../implementations";
import { Aliases, SASSImporterOptions, customImporters } from "./importer";
import { sourceToClassNames } from "./source-to-class-names";

export { Aliases };
export type ClassName = string;
interface Transformer {
  (className: ClassName): string;
}

const transformersMap = {
  camel: (className: ClassName) =>
    camelCase(className, { transform: camelCaseTransformMerge }),
  dashes: (className: ClassName) =>
    /-/.test(className) ? camelCase(className) : className,
  kebab: (className: ClassName) => transformersMap.param(className),
  none: (className: ClassName) => className,
  param: (className: ClassName) => paramCase(className),
  snake: (className: ClassName) => snakeCase(className),
} as const;

type NameFormatWithTransformer = keyof typeof transformersMap;
const NAME_FORMATS_WITH_TRANSFORMER = Object.keys(
  transformersMap
) as NameFormatWithTransformer[];

export const NAME_FORMATS = [...NAME_FORMATS_WITH_TRANSFORMER, "all"] as const;
export type NameFormat = (typeof NAME_FORMATS)[number];

export interface SASSOptions extends SASSImporterOptions {
  additionalData?: string;
  includePaths?: string[];
  nameFormat?: string | string[];
  implementation: Implementations;
}
export const nameFormatDefault: NameFormatWithTransformer = "camel";

export const fileToClassNames = async (
  file: string,
  options: ConfigOptions = {} as ConfigOptions
) => {
  const {
    additionalData,
    includePaths = [],
    nameFormat: rawNameFormat,
    implementation,
    aliases,
    aliasPrefixes,
    importer,
  } = options;

  const { renderSync } = getImplementation(implementation);

  const nameFormat = (
    typeof rawNameFormat === "string" ? [rawNameFormat] : rawNameFormat
  ) as NameFormat[];

  const nameFormats: NameFormatWithTransformer[] = nameFormat
    ? nameFormat.includes("all")
      ? NAME_FORMATS_WITH_TRANSFORMER
      : (nameFormat as NameFormatWithTransformer[])
    : [nameFormatDefault];

  const data = fs.readFileSync(file).toString();
  const result = renderSync({
    file,
    data: additionalData ? `${additionalData}\n${data}` : data,
    includePaths,
    importer: customImporters({ aliases, aliasPrefixes, importer }),
  });

  const classNames = await sourceToClassNames(result.css, file, options);
  const transformers = nameFormats.map((item) => transformersMap[item]);
  const transformedClassNames = new Set<ClassName>([]);
  classNames.forEach((className: ClassName) => {
    transformers.forEach((transformer: Transformer) => {
      transformedClassNames.add(transformer(className));
    });
  });

  return Array.from(transformedClassNames).sort((a, b) => a.localeCompare(b));
};
