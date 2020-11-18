import { listDifferent } from "../../lib/core";

import { describeAllImplementations } from "../helpers";

describeAllImplementations((implementation) => {
  describe("listDifferent", () => {
    let exit: jest.SpyInstance;

    beforeEach(() => {
      console.log = jest.fn();
      exit = jest.spyOn(process, "exit").mockImplementation();
    });

    afterEach(() => {
      exit.mockRestore();
    });

    test("logs invalid type definitions and exits with 1", async () => {
      const pattern = `${__dirname}/../**/*.scss`;

      await listDifferent(pattern, {
        banner: "",
        watch: false,
        ignoreInitial: false,
        exportType: "named",
        exportTypeName: "ClassNames",
        exportTypeInterface: "Styles",
        listDifferent: true,
        aliases: {
          "~fancy-import": "complex",
          "~another": "style",
        },
        aliasPrefixes: {
          "~": "nested-styles/",
        },
        ignore: [],
        implementation,
        quoteType: "single",
        updateStaleOnly: false,
        logLevel: "verbose",
      });

      expect(exit).toHaveBeenCalledWith(1);
      expect(console.log).toBeCalledWith(
        expect.stringContaining(`[INVALID TYPES] Check type definitions for`)
      );
      expect(console.log).toBeCalledWith(
        expect.stringContaining(`invalid.scss`)
      );
    });

    test("logs nothing and does not exit when formatted using Prettier", async () => {
      const pattern = `${__dirname}/list-different/formatted.scss`;

      await listDifferent(pattern, {
        banner: "",
        watch: false,
        ignoreInitial: false,
        exportType: "default",
        exportTypeName: "ClassNames",
        exportTypeInterface: "Styles",
        listDifferent: true,
        ignore: [],
        implementation,
        quoteType: "single",
        updateStaleOnly: false,
        logLevel: "verbose",
        nameFormat: "kebab",
      });

      expect(console.log).not.toHaveBeenCalled();
      expect(exit).not.toHaveBeenCalled();
    });

    test("logs nothing and does not exit if all files are valid", async () => {
      const pattern = `${__dirname}/../dummy-styles/**/style.scss`;

      await listDifferent(pattern, {
        banner: "",
        watch: false,
        ignoreInitial: false,
        exportType: "named",
        exportTypeName: "ClassNames",
        exportTypeInterface: "Styles",
        listDifferent: true,
        ignore: [],
        implementation,
        quoteType: "single",
        updateStaleOnly: false,
        logLevel: "verbose",
      });

      expect(exit).not.toHaveBeenCalled();
      expect(console.log).not.toHaveBeenCalled();
    });
  });
});
