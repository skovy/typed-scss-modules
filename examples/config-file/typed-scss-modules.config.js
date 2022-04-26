const jsonImporter = require("node-sass-json-importer");

export const config = {
  aliases: { "not-real": "test-value" },
  aliasPrefixes: { "also-not-real": "test-value" },
  banner: "// config file banner",
  nameFormat: "kebab",
  exportType: "default",
  importer: jsonImporter(),
};
