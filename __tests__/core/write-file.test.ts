import fs from "fs";

import { writeFile } from "../../lib/core";
import { getTypeDefinitionPath } from "../../lib/typescript";

describe("writeFile", () => {
  beforeEach(() => {
    // Only mock the write, so the example files can still be read.
    fs.writeFileSync = jest.fn();
    console.log = jest.fn();
  });

  test("writes the corresponding type definitions for a file and logs", async () => {
    const testFile = `${__dirname}/../style.scss`;
    const typesFile = getTypeDefinitionPath(testFile);

    await writeFile(testFile, {
      watch: false,
      ignoreInitial: false,
      exportType: "named",
      listDifferent: false,
      logLevel: "verbose",
      watchTimeout: 50
    });

    expect(fs.writeFileSync).toBeCalledWith(
      typesFile,
      "export const someClass: string;\n"
    );

    expect(console.log).toBeCalledWith(
      expect.stringContaining(`[GENERATED TYPES] ${typesFile}`)
    );
  });

  test("it skips files with no classes", async () => {
    const testFile = `${__dirname}/../empty.scss`;

    await writeFile(testFile, {
      watch: false,
      ignoreInitial: false,
      exportType: "named",
      listDifferent: false,
      logLevel: "verbose",
      watchTimeout: 50
    });

    expect(fs.writeFileSync).not.toBeCalled();

    expect(console.log).toBeCalledWith(
      expect.stringContaining(`[NO GENERATED TYPES] ${testFile}`)
    );
  });
});
