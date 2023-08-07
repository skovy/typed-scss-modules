import fs from "fs";
import slash from "slash";
import { alerts } from "../../lib/core";
import { main } from "../../lib/main";

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

  test("@use support", async () => {
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
    expect(fs.writeFileSync).toBeCalledTimes(1);

    const expectedDirname = slash(__dirname);
    expect(fs.writeFileSync).toBeCalledWith(
      `${expectedDirname}/use.scss.d.ts`,
      "export declare const foo: string;\n"
    );
  });
});
