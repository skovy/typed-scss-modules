import fs from "fs";
import path from "path";
import slash from "slash";

import { main } from "../lib/main";
import { describeAllImplementations } from "./helpers";

describeAllImplementations((implementation) => {
  describe("main", () => {
    beforeEach(() => {
      // Only mock the write, so the example files can still be read.
      fs.writeFileSync = jest.fn();
      console.log = jest.fn(); // avoid console logs showing up
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
        logLevel: "verbose",
      });

      expect(fs.writeFileSync).toBeCalledTimes(5);

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
        logLevel: "verbose",
      });

      expect(fs.writeFileSync).toBeCalledTimes(3);

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
  });
});
