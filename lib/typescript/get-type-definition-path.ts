/**
 * Given a file path to a SCSS file, generate the corresponding type defintion
 * file path.
 *
 * @param file the SCSS file path
 */
export const getTypeDefinitionPath = (file: string): string => `${file}.d.ts`;
