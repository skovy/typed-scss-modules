import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { generate } from "../../lib/core/index.js";
import { describeAllImplementations } from "../helpers/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

describeAllImplementations((implementation) => {
  describe("generate", () => {
    beforeEach(() => {
      // Only mock the write, so the example files can still be read.
      fs.writeFileSync = jest.fn();
      console.log = jest.fn(); // avoid console logs showing up
    });

    it("generates types for all files matching the pattern", async () => {
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

      expect(fs.writeFileSync).toHaveBeenCalledTimes(6);
    });
  });
});
