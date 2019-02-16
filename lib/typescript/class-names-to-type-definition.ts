import { ClassNames, ClassName } from "lib/sass/file-to-class-names";

export type ExportType = "named" | "default";
export const EXPORT_TYPES: ExportType[] = ["named", "default"];

const classNameToNamedTypeDefinition = (className: ClassName) =>
  `export const ${className}: string;`;

const classNameToInterfaceKey = (className: ClassName) =>
  `  '${className}': string;`;

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
        typeDefinitions = classNames.map(classNameToNamedTypeDefinition);

        // Sepearte all type definitions be a newline with a trailing newline.
        return typeDefinitions.join("\n") + "\n";
      default:
        return null;
    }
  } else {
    return null;
  }
};
