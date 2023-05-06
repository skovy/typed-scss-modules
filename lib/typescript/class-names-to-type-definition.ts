import os from "os";

import reserved from "reserved-words";

import { ClassName, ClassNameWithContent } from "lib/sass/file-to-class-names";
import { alerts } from "../core";
import { attemptPrettier } from "../prettier";

export type ExportType = "named" | "default";
export const EXPORT_TYPES: ExportType[] = ["named", "default"];

export type QuoteType = "single" | "double";
export const QUOTE_TYPES: QuoteType[] = ["single", "double"];

export interface TypeDefinitionOptions {
  banner: string;
  classNames: ClassNameWithContent[];
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

const classNameToNamedTypeDefinition = (classNameWithContent: ClassNameWithContent, quoteType: QuoteType) =>
  `export const ${classNameWithContent[0]}: ${quoteType}${classNameWithContent[1]}${quoteType};`;

const classNameToType = (classNameWithContent: ClassNameWithContent, quoteType: QuoteType) => {
  const quote = quoteType === "single" ? "'" : '"'; 
  const contentQuote = classNameWithContent[1].includes('\n') ? '`' : quote;
  return `  ${quote}${classNameWithContent[0]}${quote}: ${contentQuote}${classNameWithContent[1]}${contentQuote};`;
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

export const classNamesToTypeDefinitions = async (
  options: TypeDefinitionOptions
): Promise<string | null> => {
  if (options.classNames.length) {
    const lines: string[] = [];

    const {
      exportTypeName: ClassNames = exportTypeNameDefault,
      exportTypeInterface: Styles = exportTypeInterfaceDefault,
    } = options;

    switch (options.exportType) {
      case "default":
        if (options.banner) lines.push(options.banner);

        lines.push(`export type ${Styles} = {`);
        lines.push(
          ...options.classNames.map((className) =>
            classNameToType(className, options.quoteType || quoteTypeDefault)
          )
        );
        lines.push(`};${os.EOL}`);

        lines.push(`export type ${ClassNames} = keyof ${Styles};${os.EOL}`);
        lines.push(`declare const styles: ${Styles};${os.EOL}`);
        lines.push(`export default styles;`);

        break;
      case "named":
        if (options.banner) lines.push(options.banner);

        lines.push(
          ...options.classNames
            .filter((className) => isValidName(className[0]))
            .map((classNameWithContent) => classNameToNamedTypeDefinition(
                classNameWithContent,
                options.quoteType || quoteTypeDefault
              )
            )
        );

        break;
    }

    if (lines.length) {
      const typeDefinition = lines.join(`${os.EOL}`) + `${os.EOL}`;
      return await attemptPrettier(typeDefinition);
    } else {
      return null;
    }
  } else {
    return null;
  }
};
