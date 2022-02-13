const jsonImporter = require("node-sass-json-importer");

export const config = {
  banner: "// config file banner",
  nameFormat: "kebab",
  exportType: "default",
  importer: jsonImporter(),
};
