import reserved from "reserved-words";

import { ClassNames, ClassName } from "lib/sass/file-to-class-names";
import { alerts } from "../core";

export type ExportType = "named" | "default";
export const EXPORT_TYPES: ExportType[] = ["named", "default"];

const classNameToNamedTypeDefinition = (className: ClassName) =>
  `export const ${className}: string;`;

const classNameToInterfaceKey = (className: ClassName) =>
  `  '${className}': string;`;

const isReservedKeyword = (className: ClassName) =>
  reserved.check(className, "es5", true) ||
  reserved.check(className, "es6", true);

const isValidName = (className: ClassName) => {
  const valid = !isReservedKeyword(className);

  if (!valid) {
    alerts.warn(
      `[SKIPPING] '${className}' is a reserved keyword (consider renaming or using --exportType default).`
    );
  }

  return valid;
};

export const classNamesToTypeDefinitions = (
  classNames: ClassNames,
  exportType: ExportType
): string | null => {
  if (classNames.length) {
    let typeDefinitions;

    switch (exportType) {
      case "default":
        typeDefinitions = "interface Styles {\n";
        typeDefinitions += classNames.map(classNameToInterfaceKey).join("\n");
        typeDefinitions += "\n}\n\n";
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
