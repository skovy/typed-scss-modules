import fs from "fs";
import path from "path";
import slash from "slash";
import { fileURLToPath } from "url";
const __dirname = fileURLToPath(new URL(".", import.meta.url));
import { alerts } from "../lib/core/index.js";
import { main } from "../lib/main.js";
import { describeAllImplementations } from "./helpers/index.js";
import { jest } from "@jest/globals";
import { Implementations } from "lib/implementations/index.js";
import { type SpiedFunction } from "jest-mock";
describeAllImplementations((implementation: Implementations) => {
  describe("main", () => {
    let writeFileSyncSpy: SpiedFunction;

    beforeEach(() => {
      // Only mock the writes, so the example files can still be read.
      //@ts-expect-error - mockImplementation expects 1 argument
      writeFileSyncSpy = jest.spyOn(fs, "writeFileSync").mockImplementation();

      // Avoid creating directories while running tests.
      //@ts-expect-error - mockImplementation expects 1 argument
      jest.spyOn(fs, "mkdirSync").mockImplementation();

      // Avoid console logs showing up.
      //@ts-expect-error - mockImplementation expects 1 argument
      jest.spyOn(console, "log").mockImplementation();
      //@ts-expect-error - mockImplementation expects 1 argument
      jest.spyOn(alerts, "error").mockImplementation();
    });

    afterEach(() => {
      writeFileSyncSpy.mockReset();
    });

    test("generates types for all .scss files when the pattern is a directory", async () => {
      const pattern = `${__dirname}/dummy-styles`;

      await main(pattern, {
        banner: "",
        watch: false,
        ignoreInitial: false,
        exportType: "named",
        exportTypeName: "ClassNames",
        exportTypeInterface: "Styles",
        listDifferent: false,
        ignore: [],
        implementation,
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
      expect(fs.writeFileSync).toBeCalledTimes(9);

      const expectedDirname = slash(path.join(__dirname, "dummy-styles"));

      expect(fs.writeFileSync).toBeCalledWith(
        `${expectedDirname}/complex.scss.d.ts`,
        "export const nestedAnother: string;\nexport const nestedClass: string;\nexport const number1: string;\nexport const someStyles: string;\n"
      );
      expect(fs.writeFileSync).toBeCalledWith(
        `${expectedDirname}/style.scss.d.ts`,
        "export const someClass: string;\n"
      );
    });

    test("generates types for all .scss files and ignores files that match the ignore pattern", async () => {
      const pattern = `${__dirname}/dummy-styles`;

      await main(pattern, {
        banner: "",
        watch: false,
        ignoreInitial: false,
        exportType: "named",
        exportTypeName: "ClassNames",
        exportTypeInterface: "Styles",
        listDifferent: false,
        ignore: ["**/style.scss"],
        implementation,
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
      expect(fs.writeFileSync).toBeCalledTimes(7);

      const expectedDirname = slash(path.join(__dirname, "dummy-styles"));

      expect(fs.writeFileSync).toBeCalledWith(
        `${expectedDirname}/complex.scss.d.ts`,
        "export const nestedAnother: string;\nexport const nestedClass: string;\nexport const number1: string;\nexport const someStyles: string;\n"
      );

      // Files that should match the ignore pattern.
      expect(fs.writeFileSync).not.toBeCalledWith(
        `${expectedDirname}/style.scss.d.ts`,
        expect.anything()
      );
      expect(fs.writeFileSync).not.toBeCalledWith(
        `${expectedDirname}/nested-styles/style.scss.d.ts`,
        expect.anything()
      );
    });

    test("reads options from the configuration file", async () => {
      const pattern = `${__dirname}/dummy-styles`;

      jest.spyOn(process, "cwd").mockReturnValue(path.resolve(pattern));

      await main(pattern, {
        additionalData: "$global-red: red;",
        aliases: {
          "~fancy-import": "complex",
          "~another": "style",
        },
        aliasPrefixes: {
          "~": "nested-styles/",
        },
        exportType: "default",
      });

      expect(alerts.error).not.toHaveBeenCalled();
      expect(fs.writeFileSync).toBeCalledTimes(9);
      // Transform the calls into a more readable format for the snapshot.
      const contents = writeFileSyncSpy.mock.calls
        .map(([fullFilePath, contents]) => ({
          path: path.relative(__dirname, fullFilePath as string),
          contents,
        }))
        // Sort to avoid flakey snapshot tests if call order changes.
        .sort((a: { path: string }, b: { path: any }) =>
          a.path.localeCompare(b.path)
        );
      expect(contents).toMatchSnapshot();
    });

    test("outputs the correct files when outputFolder is passed", async () => {
      const pattern = path.resolve(__dirname, "dummy-styles");

      await main(pattern, {
        additionalData: "$global-red: red;",
        aliases: {
          "~fancy-import": "complex",
          "~another": "style",
        },
        aliasPrefixes: {
          "~": "nested-styles/",
        },
        outputFolder: "__generated__",
      });

      expect(alerts.error).not.toHaveBeenCalled();
      expect(fs.writeFileSync).toBeCalledTimes(9);
      expect(fs.mkdirSync).toBeCalledTimes(9);
      // Transform the calls into a more readable format for the snapshot.
      const contents = writeFileSyncSpy.mock.calls
        .map(([fullFilePath, contents]) => ({
          path: path.relative(__dirname, fullFilePath as string),
          contents,
        }))
        // Sort to avoid flakey snapshot tests if call order changes.
        .sort((a: { path: string }, b: { path: any }) =>
          a.path.localeCompare(b.path)
        );
      expect(contents).toMatchSnapshot();
    });
  });
});
