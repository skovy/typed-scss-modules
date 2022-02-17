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
        outputFolder: null,
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
        outputFolder: null,
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
        outputFolder: null,
      });

      expect(exit).not.toHaveBeenCalled();
      expect(console.log).not.toHaveBeenCalled();
    });

    test("logs not generated type file and exits with 1", async () => {
      const pattern = `${__dirname}/list-different/no-generated.scss`;

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
        outputFolder: null,
      });

      expect(exit).toHaveBeenCalledWith(1);
      expect(console.log).toBeCalledWith(
        expect.stringContaining(
          `[INVALID TYPES] Type file needs to be generated for`
        )
      );
      expect(console.log).toBeCalledWith(
        expect.stringContaining(`no-generated.scss`)
      );
    });
  });
});
