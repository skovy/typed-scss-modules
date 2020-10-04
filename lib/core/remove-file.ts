import fs from "fs";

import { alerts } from "./alerts";
import { getTypeDefinitionPath } from "../typescript";

/**
 * Given a single file remove the generated types if they exist
 *
 * @param file the SCSS file to generate types for
 */
export const removeFile = (file: string): void => {
  if (fs.existsSync(file)) {
    return;
  }
  const path = getTypeDefinitionPath(file);
  try {
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
      alerts.success(`[REMOVED TYPES] ${path}`);
    }
  } catch (error) {
    alerts.error(
      `An error occurred removing ${file}:\n${JSON.stringify(error)}`
    );
  }
};
