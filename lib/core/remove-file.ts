import fs from "fs";

import { alerts } from "./alerts";
import { getTypeDefinitionPath } from "../typescript";
import { ConfigOptions } from ".";

/**
 * Given a single file remove the file
 *
 * @param file any file to remove
 */

const removeFile = (file: string): void => {
  try {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      alerts.success(`[REMOVED] ${file}`);
    }
  } catch (error) {
    alerts.error(
      `An error occurred removing ${file}:\n${JSON.stringify(error)}`
    );
  }
};

/**
 * Given a single file remove the generated types if they exist
 *
 * @param file the SCSS file to generate types for
 */
export const removeSCSSTypeDefinitionFile = (
  file: string,
  options: ConfigOptions
): void => {
  const path = getTypeDefinitionPath(file, options);
  removeFile(path);
};
