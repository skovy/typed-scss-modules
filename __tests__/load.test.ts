import path from "path";
import { loadConfig, mergeOptions, DEFAULT_OPTIONS } from "../lib/load";

const CONFIG_CASES = [
  "js-default-export",
  "js-module-exports",
  "js-named-export",
  "ts-default-export",
  "ts-named-export",
];

describe("#loadConfig", () => {
  it.each(CONFIG_CASES)(
    "should load the '%s' config file correctly",
    // Spoof the current working directory so when the config file is read
    // we can direct it to any path we want. This makes it easier to test
    // various kinds of configuration files as if they were in the root.
    async (configCaseName) => {
      jest
        .spyOn(process, "cwd")
        .mockReturnValue(path.resolve(`__tests__/configs/${configCaseName}`));

      const config = await loadConfig();

      if (config && "banner" in config) {
        expect(config).toEqual({ banner: `// ${configCaseName}` });
      } else {
        throw new Error(
          `Failed to load the correct config. The loaded config was: ${JSON.stringify(
            config
          )}`
        );
      }
    }
  );
});

describe("#mergeOptions", () => {
  it("should return the default options by default", () => {
    expect(mergeOptions({}, {})).toEqual(DEFAULT_OPTIONS);
  });

  it("should allow overriding all default options via the CLI options", () => {
    expect(
      mergeOptions(
        {
          nameFormat: "kebab",
          implementation: "sass",
          exportType: "default",
          exportTypeName: "Classes",
          exportTypeInterface: "AllStyles",
          watch: true,
          ignoreInitial: true,
          listDifferent: true,
          ignore: ["path"],
          quoteType: "double",
          updateStaleOnly: true,
          logLevel: "silent",
          outputFolder: "__generated__",
          banner: "// override",
        },
        {}
      )
    ).toEqual({
      nameFormat: "kebab",
      implementation: "sass",
      exportType: "default",
      exportTypeName: "Classes",
      exportTypeInterface: "AllStyles",
      watch: true,
      ignoreInitial: true,
      listDifferent: true,
      ignore: ["path"],
      quoteType: "double",
      updateStaleOnly: true,
      logLevel: "silent",
      outputFolder: "__generated__",
      banner: "// override",
    });
  });

  it("should allow overriding all default options via the config options", () => {
    const importer = jest.fn();

    expect(
      mergeOptions(
        {},
        {
          nameFormat: "kebab",
          implementation: "sass",
          exportType: "default",
          exportTypeName: "Classes",
          exportTypeInterface: "AllStyles",
          watch: true,
          ignoreInitial: true,
          listDifferent: true,
          ignore: ["path"],
          quoteType: "double",
          updateStaleOnly: true,
          logLevel: "silent",
          banner: "// override",
          outputFolder: "__generated__",
          importer,
        }
      )
    ).toEqual({
      nameFormat: "kebab",
      implementation: "sass",
      exportType: "default",
      exportTypeName: "Classes",
      exportTypeInterface: "AllStyles",
      watch: true,
      ignoreInitial: true,
      listDifferent: true,
      ignore: ["path"],
      quoteType: "double",
      updateStaleOnly: true,
      logLevel: "silent",
      banner: "// override",
      outputFolder: "__generated__",
      importer,
    });
  });

  it("should give precedence to CLI options and still merge config-only options", () => {
    const importer = jest.fn();

    expect(
      mergeOptions(
        {
          nameFormat: "kebab",
          implementation: "sass",
          exportType: "default",
          exportTypeName: "Classes",
          exportTypeInterface: "AllStyles",
          watch: true,
          ignoreInitial: true,
          listDifferent: true,
          ignore: ["path"],
          quoteType: "double",
          updateStaleOnly: true,
          logLevel: "silent",
          banner: "// override",
          outputFolder: "__cli-generated__",
        },
        {
          nameFormat: "param",
          implementation: "node-sass",
          exportType: "named",
          exportTypeName: "Classnames",
          exportTypeInterface: "TheStyles",
          watch: false,
          ignoreInitial: false,
          listDifferent: false,
          ignore: ["another/path"],
          quoteType: "single",
          updateStaleOnly: false,
          logLevel: "info",
          banner: "// not override",
          outputFolder: "__generated__",
          importer,
        }
      )
    ).toEqual({
      nameFormat: "kebab",
      implementation: "sass",
      exportType: "default",
      exportTypeName: "Classes",
      exportTypeInterface: "AllStyles",
      watch: true,
      ignoreInitial: true,
      listDifferent: true,
      ignore: ["path"],
      quoteType: "double",
      updateStaleOnly: true,
      logLevel: "silent",
      banner: "// override",
      outputFolder: "__cli-generated__",
      importer,
    });
  });
});
