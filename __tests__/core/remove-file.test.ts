import fs, { type PathLike } from "fs";
import path from "path";
import { jest } from "@jest/globals";
import { DEFAULT_OPTIONS } from "../../lib/load.js";
import { alerts, type WrappedCbFunc } from "../../lib/core/alerts.js";
import { removeSCSSTypeDefinitionFile } from "../../lib/core/remove-file.js";
import { fileURLToPath } from "url";
import { type SpyInstance } from "jest-mock";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
describe("removeFile", () => {
  const originalTestFile = path.resolve(__dirname, "..", "removable.scss");
  const existingFile = path.resolve(__dirname, "..", "style.scss");
  const existingTypes = path.join(
    process.cwd(),
    "__tests__/removable.scss.d.ts"
  );
  const outputFolderExistingTypes = path.resolve(
    process.cwd(),
    "__generated__/__tests__/removable.scss.d.ts"
  );

  let existsSpy: SpyInstance<(path: PathLike) => boolean>;
  let unlinkSpy: SpyInstance<(path: PathLike) => void>;
  let alertsSpy: SpyInstance<WrappedCbFunc<(message: string) => void>>;

  beforeEach(() => {
    existsSpy = jest
      .spyOn(fs, "existsSync")
      .mockImplementation(
        (path) =>
          path === existingTypes ||
          path === existingFile ||
          path === outputFolderExistingTypes
      );

    // @ts-expect-error - mockImplementation expects 1 argument
    unlinkSpy = jest.spyOn(fs, "unlinkSync").mockImplementation();
    // @ts-expect-error - mockImplementation expects 1 argument
    alertsSpy = jest.spyOn(alerts, "success").mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("does nothing if types file doesn't exist", async () => {
    const nonExistingFile = path.resolve(__dirname, "..", "deleted.scss");
    const nonExistingTypes = path.join(
      process.cwd(),
      "__tests__/deleted.scss.d.ts"
    );

    removeSCSSTypeDefinitionFile(nonExistingFile, DEFAULT_OPTIONS);

    expect(existsSpy).toBeCalledWith(expect.stringMatching(nonExistingFile));
    expect(existsSpy).toBeCalledWith(expect.stringMatching(nonExistingTypes));
    expect(unlinkSpy).not.toBeCalled();
    expect(alertsSpy).not.toBeCalled();
  });

  it("removes *.scss.d.ts types file for *.scss", () => {
    removeSCSSTypeDefinitionFile(originalTestFile, DEFAULT_OPTIONS);

    expect(existsSpy).toBeCalledWith(expect.stringMatching(existingTypes));
    expect(unlinkSpy).toBeCalled();
    expect(unlinkSpy).toBeCalledWith(expect.stringMatching(existingTypes));
    expect(alertsSpy).toBeCalled();
  });

  describe("when outputFolder is passed", () => {
    it("removes the correct files", async () => {
      removeSCSSTypeDefinitionFile(originalTestFile, {
        ...DEFAULT_OPTIONS,
        outputFolder: "__generated__",
      });

      expect(existsSpy).toBeCalledWith(
        expect.stringMatching(outputFolderExistingTypes)
      );
      expect(unlinkSpy).toBeCalled();
      expect(unlinkSpy).toBeCalledWith(
        expect.stringMatching(outputFolderExistingTypes)
      );
      expect(alertsSpy).toBeCalled();
    });
  });
});
