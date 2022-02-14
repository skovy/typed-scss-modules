import { aliasImporter, customImporters } from "../../lib/sass/importer";

// SASS importers receive two other arguments that this package doesn't care about.
const fakePrev = "";
const fakeDone = () => {};

describe("#aliasImporter", () => {
  it("should create an importer to replace aliases and otherwise return null", () => {
    const importer = aliasImporter({
      aliases: { input: "output", "~alias": "node_modules" },
      aliasPrefixes: {},
    });

    expect(importer("input", fakePrev, fakeDone)).toEqual({ file: "output" });
    expect(importer("~alias", fakePrev, fakeDone)).toEqual({
      file: "node_modules",
    });
    expect(importer("output", fakePrev, fakeDone)).toBeNull();
    expect(importer("input-substring", fakePrev, fakeDone)).toBeNull();
    expect(importer("other", fakePrev, fakeDone)).toBeNull();
  });

  it("should create an importer to replace alias prefixes and otherwise return null", () => {
    const importer = aliasImporter({
      aliases: {},
      aliasPrefixes: { "~": "node_modules/", abc: "def" },
    });

    expect(importer("abc-123", fakePrev, fakeDone)).toEqual({
      file: "def-123",
    });
    expect(importer("~package", fakePrev, fakeDone)).toEqual({
      file: "node_modules/package",
    });
    expect(importer("output~", fakePrev, fakeDone)).toBeNull();
    expect(importer("input-substring-abc", fakePrev, fakeDone)).toBeNull();
    expect(importer("other", fakePrev, fakeDone)).toBeNull();
  });
});

describe("#customImporters", () => {
  beforeEach(() => {
    console.log = jest.fn(); // avoid console logs showing up
  });

  it("should return only an alias importer by default", () => {
    const importers = customImporters({
      aliases: { "~alias": "secret/path" },
      aliasPrefixes: { "~": "node_modules/" },
    });

    expect(importers).toHaveLength(1);

    const [aliasImporter] = importers;
    expect(aliasImporter("~package", fakePrev, fakeDone)).toEqual({
      file: "node_modules/package",
    });
    expect(aliasImporter("~alias", fakePrev, fakeDone)).toEqual({
      file: "secret/path",
    });
    expect(aliasImporter("other", fakePrev, fakeDone)).toBeNull();
  });

  it("should add additional importers if passed a function", () => {
    const importer = jest.fn();

    const importers = customImporters({
      aliases: {},
      aliasPrefixes: {},
      importer,
    });

    expect(importers).toHaveLength(2);
    expect(importers[1]).toEqual(importer);
  });

  it("should add multiple importers if passed an array", () => {
    const importer1 = jest.fn();
    const importer2 = jest.fn();
    const importer3 = jest.fn();

    const importers = customImporters({
      aliases: {},
      aliasPrefixes: {},
      importer: [importer1, importer2, importer3],
    });

    expect(importers).toHaveLength(4);
    expect(importers[1]).toEqual(importer1);
    expect(importers[2]).toEqual(importer2);
    expect(importers[3]).toEqual(importer3);
  });
});
