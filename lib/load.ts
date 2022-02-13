import path from "path";
import JoyCon from "joycon";
import { bundleRequire } from "bundle-require";
import { alerts, CLIOptions, ConfigOptions } from "./core";

const VALID_CONFIG_FILES = [
  "typed-scss-modules.config.ts",
  "typed-scss-modules.config.js",
];
const CURRENT_WORKING_DIRECTORY = process.cwd();
const joycon = new JoyCon();

/**
 * Load a custom config file in the project root directory with any options for this package.
 *
 * This support config files with the format:
 *  - Named `config` export: `export const config = {}`
 *  - Default export: `export default {}`
 */
export const loadConfig = async (): Promise<{} | ConfigOptions> => {
  const configPath = await joycon.resolve(
    VALID_CONFIG_FILES,
    CURRENT_WORKING_DIRECTORY,
    path.parse(CURRENT_WORKING_DIRECTORY).root
  );

  if (configPath) {
    try {
      const configModule = await bundleRequire({
        filepath: configPath,
      });

      const config: ConfigOptions =
        configModule.mod.config || configModule.mod.default || configModule.mod;

      return config;
    } catch (error) {
      alerts.error(
        `An error occurred loading the config file "${configPath}":\n${error}`
      );

      return {};
    }
  }

  return {};
};

/**
 * Given both the CLI and config file options merge into a single options object.
 *
 * When possible, CLI options will override config file options.
 *
 * Some options are only available in the config file. For example, a custom function can't
 * be easily defined via the CLI so some complex options are only available in the config file.
 */
export const mergeOptions = (
  cliOptions: CLIOptions,
  configOptions: Partial<ConfigOptions>
): CLIOptions & ConfigOptions => {
  return { ...configOptions, ...cliOptions };
};
