import fs from "fs";
import { dirname } from "path";
import slash from "slash";
import { fileURLToPath } from "url";
import { alerts } from "../../lib/core/index.js";
import { main } from "../../lib/main.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("dart-sass", () => {
  let writeFileSyncSpy: jest.SpyInstance;

  beforeEach(() => {
    // Only mock the writes, so the example files can still be read.
    writeFileSyncSpy = jest.spyOn(fs, "writeFileSync").mockImplementation();

    // Avoid creating directories while running tests.
    jest.spyOn(fs, "mkdirSync").mockImplementation();

    // Avoid console logs showing up.
    jest.spyOn(console, "log").mockImplementation();

    jest.spyOn(alerts, "error").mockImplementation();
  });

  afterEach(() => {
    writeFileSyncSpy.mockReset();
  });

  it("@use support", async () => {
    const pattern = `${__dirname}`;

    await main(pattern, {
      banner: "",
      watch: false,
      ignoreInitial: false,
      exportType: "named",
      exportTypeName: "ClassNames",
      exportTypeInterface: "Styles",
      listDifferent: false,
      ignore: [],
      implementation: "sass",
      quoteType: "single",
      updateStaleOnly: false,
      logLevel: "verbose",
      additionalData: "$global-red: red;",
      aliases: {
        "~fancy-import": "complex",
        "~another": "style",
      },
      aliasPrefixes: {
        "~": "nested-styles/",
      },
    });

    expect(alerts.error).not.toHaveBeenCalled();
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);

    const expectedDirname = slash(__dirname);

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      `${expectedDirname}/use.scss.d.ts`,
      "export declare const foo: string;\n",
    );
  });
});
