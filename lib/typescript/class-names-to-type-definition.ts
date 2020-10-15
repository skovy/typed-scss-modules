import os from "os";

import reserved from "reserved-words";

import { ClassNames, ClassName } from "lib/sass/file-to-class-names";
import { alerts } from "../core";

export type ExportType = "named" | "default";
export const EXPORT_TYPES: ExportType[] = ["named", "default"];

export type QuoteType = "single" | "double";
export const QUOTE_TYPES: QuoteType[] = ["single", "double"];

export interface TypeDefinitionOptions {
  banner: string;
  classNames: ClassNames;
  exportType: ExportType;
  exportTypeName?: string;
  exportTypeInterface?: string;
  quoteType?: QuoteType;
}

export const exportTypeDefault: ExportType = "named";
export const exportTypeNameDefault: string = "ClassNames";
export const exportTypeInterfaceDefault: string = "Styles";
export const quoteTypeDefault: QuoteType = "single";
export const bannerTypeDefault: string = "";

const classNameToNamedTypeDefinition = (className: ClassName) =>
  `export const ${className}: string;`;

const classNameToType = (className: ClassName, quoteType: QuoteType) => {
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
  options: TypeDefinitionOptions
): string | null => {
  if (options.classNames.length) {
    let typeDefinitions;

    const {
      exportTypeName: ClassNames = exportTypeNameDefault,
      exportTypeInterface: Styles = exportTypeInterfaceDefault,
    } = options;

    switch (options.exportType) {
      case "default":
        typeDefinitions = options.banner || "";
        typeDefinitions += `export type ${Styles} = {${os.EOL}`;
        typeDefinitions += options.classNames
          .map((className) =>
            classNameToType(className, options.quoteType || quoteTypeDefault)
          )
          .join(`${os.EOL}`);
        typeDefinitions += `${os.EOL}}${os.EOL}${os.EOL}`;
        typeDefinitions += `export type ${ClassNames} = keyof ${Styles};${os.EOL}${os.EOL}`;
        typeDefinitions += `declare const styles: ${Styles};${os.EOL}${os.EOL}`;
        typeDefinitions += `export default styles;${os.EOL}`;
        return typeDefinitions;
      case "named":
        typeDefinitions = options.classNames
          .filter(isValidName)
          .map(classNameToNamedTypeDefinition);

        if (options.banner) {
          typeDefinitions.unshift(options.banner);
        }

        // Separate all type definitions be a newline with a trailing newline.
        return typeDefinitions.join(`${os.EOL}`) + `${os.EOL}`;
      default:
        return null;
    }
  } else {
    return null;
  }
};
