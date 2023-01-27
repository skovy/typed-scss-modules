import fs from "fs";
import path from "path";
import { jest } from "@jest/globals";
import { writeFile } from "../../lib/core/index.js";
import { fileURLToPath } from "url";
const __dirname = fileURLToPath(new URL(".", import.meta.url));
import { describeAllImplementations } from "../helpers/index.js";
import { Implementations } from "lib/implementations/index.js";

describeAllImplementations((implementation: Implementations) => {
  describe("writeFile", () => {
    beforeEach(() => {
      // Only mock the write, so the example files can still be read.
      jest.spyOn(fs, "writeFileSync").mockImplementation(() => {});

      // Avoid creating new directories while running tests.
      jest.spyOn(fs, "mkdirSync").mockImplementation(() => "{}");

      console.log = jest.fn();
    });

    test("writes the corresponding type definitions for a file and logs", async () => {
      const testFile = path.resolve(__dirname, "..", "dummy-styles/style.scss");

      await writeFile(testFile, {
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
        outputFolder: null,
      });

      const expectedPath = path.join(
        process.cwd(),
        "__tests__/dummy-styles/style.scss.d.ts"
      );
      expect(fs.writeFileSync).toBeCalledWith(
        expectedPath,
        "export const someClass: string;\n"
      );
      expect(console.log).toBeCalledWith(
        expect.stringContaining(`[GENERATED TYPES] ${expectedPath}`)
      );
    });

    test("it skips files with no classes", async () => {
      const testFile = path.resolve(__dirname, "..", "dummy-styles/empty.scss");

      await writeFile(testFile, {
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
        outputFolder: null,
      });

      expect(fs.writeFileSync).not.toBeCalled();
      expect(console.log).toBeCalledWith(
        expect.stringContaining(`[NO GENERATED TYPES] ${testFile}`)
      );
    });

    describe("when outputFolder is passed", () => {
      it("should write to the correct path", async () => {
        const testFile = path.resolve(
          __dirname,
          "..",
          "dummy-styles/style.scss"
        );

        await writeFile(testFile, {
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
          outputFolder: "__generated__",
        });

        const expectedPath = path.join(
          process.cwd(),
          "__generated__/__tests__/dummy-styles/style.scss.d.ts"
        );
        expect(fs.writeFileSync).toBeCalledWith(
          expectedPath,
          "export const someClass: string;\n"
        );
        expect(console.log).toBeCalledWith(
          expect.stringContaining(`[GENERATED TYPES] ${expectedPath}`)
        );
      });
    });

    describe("when --updateStaleOnly is passed", () => {
      const testFile = path.resolve(__dirname, "..", "dummy-styles/style.scss");
      const expectedPath = path.join(
        process.cwd(),
        "__tests__/dummy-styles/style.scss.d.ts"
      );
      beforeEach(() => {
        jest.spyOn(fs, "statSync");
        jest.spyOn(fs, "existsSync");
        (fs.existsSync as jest.Mock).mockImplementation(() => true);
      });

      afterEach(() => {
        (fs.statSync as jest.Mock).mockRestore();
        (fs.existsSync as jest.Mock).mockRestore();
      });

      test("it skips stale files", async () => {
        (fs.statSync as jest.Mock).mockImplementation((p) => ({
          mtime:
            p === expectedPath ? new Date(2020, 0, 2) : new Date(2020, 0, 1),
        }));

        await writeFile(testFile, {
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
          updateStaleOnly: true,
          logLevel: "verbose",
          outputFolder: null,
        });

        expect(fs.writeFileSync).not.toBeCalled();
      });

      test("it updates files that aren't stale", async () => {
        (fs.statSync as jest.Mock).mockImplementation(
          () => new Date(2020, 0, 1)
        );

        await writeFile(testFile, {
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
          updateStaleOnly: true,
          logLevel: "verbose",
          outputFolder: null,
        });

        expect(fs.writeFileSync).toBeCalled();
      });

      test("it doesn't attempt to access a non-existent file", async () => {
        (fs.existsSync as jest.Mock).mockImplementation(() => false);

        await writeFile(testFile, {
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
          updateStaleOnly: true,
          logLevel: "verbose",
          outputFolder: null,
        });

        expect(fs.statSync).not.toBeCalled();
      });
    });
  });
});
