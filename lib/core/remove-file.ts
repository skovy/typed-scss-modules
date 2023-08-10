import fs from "fs";
import { getTypeDefinitionPath } from "../typescript/index.js";
import { alerts } from "./alerts.js";
import { ConfigOptions } from "./index.js";

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
      `An error occurred removing ${file}:\n${JSON.stringify(error)}`,
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
  options: ConfigOptions,
): void => {
  const path = getTypeDefinitionPath(file, options);
  removeFile(path);
};
