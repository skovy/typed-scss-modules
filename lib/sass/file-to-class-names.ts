import fs from "fs";
import {
  camelCase,
  camelCaseTransformMerge,
  paramCase,
  snakeCase,
} from "change-case";

import { sourceToClassNames } from "./source-to-class-names";
import { Implementations, getImplementation } from "../implementations";
import { customImporters, Aliases, SASSImporterOptions } from "./importer";

export { Aliases };
export type ClassName = string;
export type ClassNameWithContent = [ClassName, string];
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
export type NameFormat = typeof NAME_FORMATS[number];

export interface SASSOptions extends SASSImporterOptions {
  additionalData?: string;
  includePaths?: string[];
  nameFormat?: string | string[];
  implementation: Implementations;
  withContent?: boolean;
}
export const nameFormatDefault: NameFormatWithTransformer = "camel";

export const fileToClassNames = async (
  file: string,
  {
    additionalData,
    includePaths = [],
    nameFormat: rawNameFormat,
    implementation,
    aliases,
    aliasPrefixes,
    importer,
    withContent = true,
  }: SASSOptions = {} as SASSOptions
) => {
  const { renderSync } = getImplementation(implementation);

  const nameFormat = (
    typeof rawNameFormat === "string" ? [rawNameFormat] : rawNameFormat
  ) as NameFormat[];

  let nameFormats: NameFormatWithTransformer[] = nameFormat
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

  const { exportTokens, injectableSource } = await sourceToClassNames(result.css);
  // const classNames = Object.keys(exportTokens);
  const transformers = nameFormats.map((item) => transformersMap[item]);
  const transformedClassNames = new Set<ClassNameWithContent>([]);
  // classNames.forEach((className: ClassName) => {
  //   transformers.forEach((transformer: Transformer) => {
  //     transformedClassNames.add(transformer(className));
  //   });
  // });
  for (const [classname, value] of Object.entries(exportTokens)) {
    const stringToMatch = `${value} {`;
    const indexOfStart = injectableSource.indexOf(stringToMatch) + stringToMatch.length;
    const indexOfEnd = injectableSource.indexOf("}", indexOfStart);
    const sub = injectableSource.substring(
      indexOfStart, 
      indexOfEnd
    );
    if (withContent) {
      transformers.forEach((transformer: Transformer) => {
        transformedClassNames.add([transformer(classname), sub.trim()]);
      });
    } else {
      transformers.forEach((transformer: Transformer) => {
        transformedClassNames.add([transformer(classname), 'string;']);
      });
    }
  }

  return Array.from(transformedClassNames).sort((a, b) => a[0].localeCompare(b[0]));
};
