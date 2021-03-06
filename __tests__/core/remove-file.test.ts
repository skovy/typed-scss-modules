import fs from "fs";

import { alerts } from "../../lib/core/alerts";
import { removeSCSSTypeDefinitionFile } from "../../lib/core/remove-file";
import { getTypeDefinitionPath } from "../../lib/typescript";

jest.mock("fs");
jest.mock("../../lib/core/alerts");

describe("removeFile", () => {
  const originalTestFile = `${__dirname}/../removable.scss`;
  const existingFile = `${__dirname}/../style.scss`;
  const existingTypes = getTypeDefinitionPath(originalTestFile);

  beforeEach(() => {
    (fs.existsSync as jest.Mock).mockImplementation(
      (path: fs.PathLike): boolean =>
        path === existingTypes || path === existingFile
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("does nothing if types file doesn't exist", async () => {
    const existsSyncSpy = fs.existsSync;
    const unlinkSyncSpy = fs.unlinkSync;
    const nonExistingFile = `${__dirname}/../deleted.scss`;
    const nonExistingTypes = getTypeDefinitionPath(nonExistingFile);
    removeSCSSTypeDefinitionFile(nonExistingFile);
    expect(existsSyncSpy).toBeCalledWith(
      expect.stringMatching(nonExistingFile)
    );
    expect(existsSyncSpy).toBeCalledWith(
      expect.stringMatching(nonExistingTypes)
    );
    expect(unlinkSyncSpy).not.toBeCalled();
    expect(alerts.success).not.toBeCalled();
  });
  it("removes *.scss.d.ts types file for *.scss", () => {
    const existsSyncSpy = fs.existsSync;
    const unlinkSyncSpy = fs.unlinkSync;
    removeSCSSTypeDefinitionFile(originalTestFile);
    expect(existsSyncSpy).toBeCalledWith(expect.stringMatching(existingTypes));
    expect(unlinkSyncSpy).toBeCalled();
    expect(unlinkSyncSpy).toBeCalledWith(expect.stringMatching(existingTypes));
    expect(alerts.success).toBeCalled();
  });
});
