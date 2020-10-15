import fs from "fs";

import { writeFile } from "../../lib/core";
import { getTypeDefinitionPath } from "../../lib/typescript";

import { describeAllImplementations } from "../helpers";

describeAllImplementations((implementation) => {
  describe("writeFile", () => {
    beforeEach(() => {
      // Only mock the write, so the example files can still be read.
      fs.writeFileSync = jest.fn();
      console.log = jest.fn();
    });

    test("writes the corresponding type definitions for a file and logs", async () => {
      const testFile = `${__dirname}/../dummy-styles/style.scss`;
      const typesFile = getTypeDefinitionPath(testFile);

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
        logLevel: "verbose",
      });

      expect(fs.writeFileSync).toBeCalledWith(
        typesFile,
        "export const someClass: string;\n"
      );

      expect(console.log).toBeCalledWith(
        expect.stringContaining(`[GENERATED TYPES] ${typesFile}`)
      );
    });

    test("it skips files with no classes", async () => {
      const testFile = `${__dirname}/../dummy-styles/empty.scss`;

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
        logLevel: "verbose",
      });

      expect(fs.writeFileSync).not.toBeCalled();

      expect(console.log).toBeCalledWith(
        expect.stringContaining(`[NO GENERATED TYPES] ${testFile}`)
      );
    });
  });
});
