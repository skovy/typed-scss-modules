import { ClassNames, ClassName } from "lib/sass/file-to-class-names";

const classNameToTypeDefinition = (className: ClassName) =>
  `export const ${className}: string;`;

export const classNamesToTypeDefinitions = (
  classNames: ClassNames
): string | null => {
  if (classNames.length) {
    const typeDefinitions = classNames.map(classNameToTypeDefinition);

    // Sepearte all type definitions be a newline with a trailing newline.
    return typeDefinitions.join("\n") + "\n";
  } else {
    return null;
  }
};
