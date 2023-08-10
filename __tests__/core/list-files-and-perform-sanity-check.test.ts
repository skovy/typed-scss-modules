import { dirname } from "path";
import { fileURLToPath } from "url";
import {
  ConfigOptions,
  listFilesAndPerformSanityChecks,
} from "../../lib/core/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const options: ConfigOptions = {
  banner: "",
  watch: false,
  ignoreInitial: false,
  exportType: "named",
  exportTypeName: "ClassNames",
  exportTypeInterface: "Styles",
  listDifferent: true,
  ignore: [],
  implementation: "sass",
  quoteType: "single",
  updateStaleOnly: false,
  logLevel: "verbose",
  outputFolder: null,
};

describe("listAllFilesAndPerformSanityCheck", () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  it("prints a warning if the pattern matches 0 files", () => {
    const pattern = `${__dirname}/list-different/test.txt`;

    listFilesAndPerformSanityChecks(pattern, options);

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("No files found."),
    );
  });

  it("prints a warning if the pattern matches 1 file", () => {
    const pattern = `${__dirname}/list-different/formatted.scss`;

    listFilesAndPerformSanityChecks(pattern, options);

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("Only 1 file found for"),
    );
  });
});
