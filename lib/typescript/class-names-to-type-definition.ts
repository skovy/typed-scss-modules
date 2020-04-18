import reserved from "reserved-words";

import {
  ClassNames,
  ClassName,
  NameFormat
} from "lib/sass/file-to-class-names";
import { alerts } from "../core";

export type ExportType = "named" | "default";
export const EXPORT_TYPES: ExportType[] = ["named", "default"];

export type QuoteType = "single" | "double" | "none";
export const QUOTE_TYPES: QuoteType[] = ["single", "double", "none"];

export interface TypeDefinitionOptions {
  classNames: ClassNames;
  exportType: ExportType;
  exportTypeName?: string;
  exportTypeInterface?: string;
  quoteType?: QuoteType;
  nameFormat?: NameFormat;
}

export const exportTypeDefault: ExportType = "named";
export const exportTypeNameDefault: string = "ClassNames";
export const exportTypeInterfaceDefault: string = "Styles";
export const quoteTypeDefault: QuoteType = "single";

const classNameToNamedTypeDefinition = (className: ClassName) =>
  `export const ${className}: string;`;

const classNameToInterfaceKey = (
  className: ClassName,
  quoteType: QuoteType
) => {
  let quote = "";
  switch (quoteType) {
    case "none":
      quote = "";
      break;
    case "double":
      quote = '"';
      break;
    default:
    case "single":
      quote = "'";
      break;
  }

  return `  ${quote}${className}${quote}: string;`;
};

const isReservedKeyword = (className: ClassName) =>
  reserved.check(className, "es5", true) ||
  reserved.check(className, "es6", true);

const isValidNameForDefaultExport = (
  className: ClassName,
  quoteType: QuoteType,
  nameFormat: NameFormat
) => {
  const nameFormatsThatMayNeedQuotes: NameFormat[] = ["kebab", "param"];
  const nameFormatMayNeedQuotes = nameFormatsThatMayNeedQuotes.indexOf(
    nameFormat
  );

  if (quoteType === "none" && nameFormatMayNeedQuotes && /-/.test(className)) {
    alerts.warn(
      `[SKIPPING] '${className}' contains dashes but --quoteType is none (consider using 'camel' for --nameFormat or choosing an other --quoteType).`
    );
    return false;
  }

  return true;
};

const isValidNameForExport = (className: ClassName) => {
  if (isReservedKeyword(className)) {
    alerts.warn(
      `[SKIPPING] '${className}' is a reserved keyword (consider renaming or using --exportType default).`
    );
    return false;
  } else if (/-/.test(className)) {
    alerts.warn(
      `[SKIPPING] '${className}' contains dashes (consider using 'camel' or 'dashes' for --nameFormat or using --exportType default).`
    );
    return false;
  }

  return true;
};

export const classNamesToTypeDefinitions = (
  options: TypeDefinitionOptions
): string | null => {
  if (options.classNames.length) {
    let typeDefinitions;

    const {
      nameFormat = "camel",
      quoteType = quoteTypeDefault,
      exportTypeName: ClassNames = exportTypeNameDefault,
      exportTypeInterface: Styles = exportTypeInterfaceDefault
    } = options;

    switch (options.exportType) {
      case "default":
        typeDefinitions = `export interface ${Styles} {\n`;
        typeDefinitions += options.classNames
          .filter(className =>
            isValidNameForDefaultExport(className, quoteType, nameFormat)
          )
          .map(className => classNameToInterfaceKey(className, quoteType))
          .join("\n");
        typeDefinitions += "\n}\n\n";
        typeDefinitions += `export type ${ClassNames} = keyof ${Styles};\n\n`;
        typeDefinitions += `declare const styles: ${Styles};\n\n`;
        typeDefinitions += "export default styles;\n";
        return typeDefinitions;
      case "named":
        typeDefinitions = options.classNames
          .filter(isValidNameForExport)
          .map(classNameToNamedTypeDefinition);

        // Sepearte all type definitions be a newline with a trailing newline.
        return typeDefinitions.join("\n") + "\n";
      default:
        return null;
    }
  } else {
    return null;
  }
};
