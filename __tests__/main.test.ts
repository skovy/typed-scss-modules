import fs from "fs";
import path from "path";
import slash from "slash";

import { main } from "../lib/main";
import { describeAllImplementations } from "./helpers";

describeAllImplementations((implementation) => {
  describe("main", () => {
    let writeFileSyncSpy: jest.SpyInstance;

    beforeEach(() => {
      // Only mock the write, so the example files can still be read.
      writeFileSyncSpy = jest.spyOn(fs, "writeFileSync").mockImplementation();
      console.log = jest.fn(); // avoid console logs showing up
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
      });

      expect(fs.writeFileSync).toBeCalledTimes(6);

      const expectedDirname = slash(path.join(__dirname, "dummy-styles"));

      expect(fs.writeFileSync).toBeCalledWith(
        `${expectedDirname}/complex.scss.d.ts`,
        "export const nestedAnother: string;\nexport const nestedClass: string;\nexport const someStyles: string;\n"
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
      });

      expect(fs.writeFileSync).toBeCalledTimes(4);

      const expectedDirname = slash(path.join(__dirname, "dummy-styles"));

      expect(fs.writeFileSync).toBeCalledWith(
        `${expectedDirname}/complex.scss.d.ts`,
        "export const nestedAnother: string;\nexport const nestedClass: string;\nexport const someStyles: string;\n"
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
        exportType: "default",
      });

      expect(fs.writeFileSync).toBeCalledTimes(6);
      // Transform the calls into a more readable format for the snapshot.
      const contents = writeFileSyncSpy.mock.calls
        .map(([fullFilePath, contents]) => ({
          path: path.relative(__dirname, fullFilePath),
          contents,
        }))
        // Sort to avoid flakey snapshot tests if call order changes.
        .sort((a, b) => a.path.localeCompare(b.path));
      expect(contents).toMatchSnapshot();
    });
  });
});
