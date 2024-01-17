import { listDifferent } from "../../lib/core";
import { describeAllImplementations } from "../helpers";

describeAllImplementations((implementation) => {
  describe("listDifferent", () => {
    let exit: jest.SpyInstance;

    beforeEach(() => {
      console.log = jest.fn();
      console.warn = jest.fn();
      exit = jest.spyOn(process, "exit").mockImplementation();
    });

    afterEach(() => {
      exit.mockRestore();
    });

    it("logs invalid type definitions and exits with 1", async () => {
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
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining(`[INVALID TYPES] Check type definitions for`)
      );
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining(`invalid.scss`)
      );
    });

    it("logs nothing and does not exit when formatted using Prettier", async () => {
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
        nameFormat: ["kebab"],
        outputFolder: null,
      });

      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining(`Only 1 file found for`)
      );
      expect(exit).not.toHaveBeenCalled();
    });

    it("logs nothing and does not exit if all files are valid", async () => {
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
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.log).not.toHaveBeenCalled();
    });

    it("logs not generated type file and exits with 1", async () => {
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
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining(
          `[INVALID TYPES] Type file needs to be generated for`
        )
      );
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining(`no-generated.scss`)
      );
    });

    it("ignores ignored files", async () => {
      const pattern = `${__dirname}/list-different/no-generated.scss`;

      await listDifferent(pattern, {
        banner: "",
        watch: false,
        ignoreInitial: false,
        exportType: "named",
        exportTypeName: "ClassNames",
        exportTypeInterface: "Styles",
        listDifferent: true,
        ignore: ["**/no-generated.scss"],
        implementation,
        quoteType: "single",
        updateStaleOnly: false,
        logLevel: "verbose",
        outputFolder: null,
      });

      expect(exit).not.toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining(`No files found`)
      );
    });
  });
});
