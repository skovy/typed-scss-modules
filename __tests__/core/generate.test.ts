import fs from "fs";

import { generate } from "../../lib/core";
import { describeAllImplementations } from "../helpers";

describeAllImplementations(implementation => {
  describe("generate", () => {
    beforeEach(() => {
      // Only mock the write, so the example files can still be read.
      fs.writeFileSync = jest.fn();
      console.log = jest.fn(); // avoid console logs showing up
    });

    test("generates types for all files matching the pattern", async () => {
      const pattern = `${__dirname}/../**/*.scss`;

      await generate(pattern, {
        watch: false,
        ignoreInitial: false,
        exportType: "named",
        listDifferent: false,
        ignore: [],
        implementation,
        quoteType: "single"
      });

      expect(fs.writeFileSync).toBeCalledTimes(5);
    });
  });
});
