import fs, { PathOrFileDescriptor } from "fs";
import path from "path";
import { writeFile } from "../../lib/core";
import { describeAllImplementations } from "../helpers";

describeAllImplementations((implementation) => {
  describe("writeFile", () => {
    beforeEach(() => {
      // Only mock the write, so the example files can still be read.
      jest.spyOn(fs, "writeFileSync").mockImplementation();

      // Avoid creating new directories while running tests.
      jest.spyOn(fs, "mkdirSync").mockImplementation();

      // Test removing existing types.
      jest.spyOn(fs, "unlinkSync").mockImplementation();

      console.log = jest.fn();
    });

    it("writes the corresponding type definitions for a file and logs", async () => {
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
        allowArbitraryExtensions: false,
      });

      const expectedPath = path.join(
        process.cwd(),
        "__tests__/dummy-styles/style.scss.d.ts"
      );

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expectedPath,
        "export declare const someClass: string;\n"
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining(`[GENERATED TYPES] ${expectedPath}`)
      );
    });

    it("writes the corresponding type definitions for a file and logs when allowArbitraryExtensions is set", async () => {
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
        allowArbitraryExtensions: true,
      });

      const expectedPath = path.join(
        process.cwd(),
        "__tests__/dummy-styles/style.d.scss.ts"
      );

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expectedPath,
        "export declare const someClass: string;\n"
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining(`[GENERATED TYPES] ${expectedPath}`)
      );
    });

    it("skips files with no classes", async () => {
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
        allowArbitraryExtensions: false,
      });

      expect(fs.writeFileSync).not.toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining(`[NO GENERATED TYPES] ${testFile}`)
      );
    });

    describe("when a file already exists with type definitions", () => {
      const testFile = path.resolve(__dirname, "..", "dummy-styles/empty.scss");
      const existingTypes = path.join(
        process.cwd(),
        "__tests__/dummy-styles/empty.scss.d.ts"
      );
      const originalExistsSync = fs.existsSync;

      beforeEach(() => {
        jest
          .spyOn(fs, "existsSync")
          .mockImplementation((p) =>
            p === existingTypes ? true : originalExistsSync(p)
          );
      });

      afterEach(() => {
        (fs.existsSync as jest.Mock).mockRestore();
      });

      it("removes existing type definitions if no classes are found", async () => {
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
          allowArbitraryExtensions: false,
        });

        expect(fs.unlinkSync).toHaveBeenCalledWith(existingTypes);
        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining(`[REMOVED] ${existingTypes}`)
        );
      });
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
          allowArbitraryExtensions: false,
        });

        const expectedPath = path.join(
          process.cwd(),
          "__generated__/__tests__/dummy-styles/style.scss.d.ts"
        );

        expect(fs.writeFileSync).toHaveBeenCalledWith(
          expectedPath,
          "export declare const someClass: string;\n"
        );
        expect(console.log).toHaveBeenCalledWith(
          expect.stringContaining(`[GENERATED TYPES] ${expectedPath}`)
        );
      });
    });

    describe("when --updateStaleOnly is passed", () => {
      const originalReadFileSync = fs.readFileSync;
      const testFile = path.resolve(__dirname, "..", "dummy-styles/style.scss");
      const expectedPath = path.join(
        process.cwd(),
        "__tests__/dummy-styles/style.scss.d.ts"
      );

      beforeEach(() => {
        jest.spyOn(fs, "statSync");
        jest.spyOn(fs, "existsSync");
        jest.spyOn(fs, "readFileSync");
        (fs.existsSync as jest.Mock).mockImplementation(() => true);
      });

      afterEach(() => {
        (fs.statSync as jest.Mock).mockRestore();
        (fs.existsSync as jest.Mock).mockRestore();
        (fs.readFileSync as jest.Mock).mockRestore();
      });

      it("skips stale files", async () => {
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
          allowArbitraryExtensions: false,
        });

        expect(fs.writeFileSync).not.toHaveBeenCalled();
      });

      it("updates files that aren't stale", async () => {
        (fs.statSync as jest.Mock).mockImplementation(
          () => new Date(2020, 0, 1)
        );

        // Mock outdated file contents.
        (fs.readFileSync as jest.Mock).mockImplementation(
          (
            p: PathOrFileDescriptor,
            opts?: {
              encoding?: null | undefined;
              flag?: string | undefined;
            } | null
          ) => (p === expectedPath ? `` : originalReadFileSync(p, opts))
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
          allowArbitraryExtensions: false,
        });

        expect(fs.writeFileSync).toHaveBeenCalled();
      });

      it("skips files that aren't stale but type definition contents haven't changed", async () => {
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
          allowArbitraryExtensions: false,
        });

        expect(fs.writeFileSync).not.toHaveBeenCalled();
      });

      it("doesn't attempt to access a non-existent file", async () => {
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
          allowArbitraryExtensions: false,
        });

        expect(fs.statSync).not.toHaveBeenCalledWith(testFile);
      });
    });
  });
});
