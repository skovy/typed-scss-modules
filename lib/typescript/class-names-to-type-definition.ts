import reserved from "reserved-words";

import { ClassNames, ClassName } from "lib/sass/file-to-class-names";
import { alerts } from "../core";

export type ExportType = "named" | "default";
export const EXPORT_TYPES: ExportType[] = ["named", "default"];

export type QuoteType = "single" | "double";
export const QUOTE_TYPES: QuoteType[] = ["single", "double"];

const classNameToNamedTypeDefinition = (className: ClassName) =>
  `export const ${className}: string;`;

const classNameToInterfaceKey = (
  className: ClassName,
  quoteType: QuoteType
) => {
  const quote = quoteType === "single" ? "'" : '"';
  return `  ${quote}${className}${quote}: string;`;
};

const isReservedKeyword = (className: ClassName) =>
  reserved.check(className, "es5", true) ||
  reserved.check(className, "es6", true);

const isValidName = (className: ClassName) => {
  if (isReservedKeyword(className)) {
    alerts.warn(
      `[SKIPPING] '${className}' is a reserved keyword (consider renaming or using --exportType default).`
    );
    return false;
  } else if (/-/.test(className)) {
    alerts.warn(
      `[SKIPPING] '${className}' contains dashes (consider using 'camelCase' or 'dashes' for --nameFormat or using --exportType default).`
    );
    return false;
  }

  return true;
};

export const classNamesToTypeDefinitions = (
  classNames: ClassNames,
  exportType: ExportType,
  quoteType: QuoteType = "single"
): string | null => {
  if (classNames.length) {
    let typeDefinitions;

    switch (exportType) {
      case "default":
        typeDefinitions = "export interface Styles {\n";
        typeDefinitions += classNames
          .map(className => classNameToInterfaceKey(className, quoteType))
          .join("\n");
        typeDefinitions += "\n}\n\n";
        typeDefinitions += "export type ClassNames = keyof Styles;\n\n";
        typeDefinitions += "declare const styles: Styles;\n\n";
        typeDefinitions += "export default styles;\n";
        return typeDefinitions;
      case "named":
        typeDefinitions = classNames
          .filter(isValidName)
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
