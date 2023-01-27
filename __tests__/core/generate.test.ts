import fs from "fs";
import { jest } from "@jest/globals";
import { generate } from "../../lib/core/index.js";
import { describeAllImplementations } from "../helpers/index.js";
import { fileURLToPath } from "url";
import { Implementations } from "lib/implementations/index.js";
const __dirname = fileURLToPath(new URL(".", import.meta.url));
describeAllImplementations((implementation: Implementations) => {
  describe("generate", () => {
    beforeEach(() => {
      // Only mock the write, so the example files can still be read.
      fs.writeFileSync = jest.fn();
      console.log = jest.fn(); // avoid console logs showing up
    });

    test("generates types for all files matching the pattern", async () => {
      const pattern = `${__dirname}/../dummy-styles/**/*.scss`;

      await generate(pattern, {
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

      expect(fs.writeFileSync).toBeCalledTimes(6);
    });
  });
});
