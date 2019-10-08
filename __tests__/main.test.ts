import fs from "fs";
import slash from "slash";

import { main } from "../lib/main";

describe("main", () => {
  beforeEach(() => {
    // Only mock the write, so the example files can still be read.
    fs.writeFileSync = jest.fn();
    console.log = jest.fn(); // avoid console logs showing up
  });

  test("generates types for all .scss files when the pattern is a directory", async () => {
    const pattern = `${__dirname}`;

    await main(pattern, {
      watch: false,
      ignoreInitial: false,
      exportType: "named",
      listDifferent: false,
      logLevel: "verbose",
      watchTimeout: 50
    });

    const expectedDirname = slash(__dirname);

    expect(fs.writeFileSync).toBeCalledTimes(5);

    expect(fs.writeFileSync).toBeCalledWith(
      `${expectedDirname}/complex.scss.d.ts`,
      "export const someStyles: string;\nexport const nestedClass: string;\nexport const nestedAnother: string;\n"
    );
    expect(fs.writeFileSync).toBeCalledWith(
      `${expectedDirname}/style.scss.d.ts`,
      "export const someClass: string;\n"
    );
  });
});
