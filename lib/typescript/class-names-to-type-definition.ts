import { ClassNames } from "lib/sass/file-to-class-names";

export const classNamesToTypeDefinitions = (classNames: ClassNames): string => {
  return (
    classNames
      .map(className => `export const ${className}: string;`)
      .join("\n") + "\n"
  );
};
