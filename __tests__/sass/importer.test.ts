import { SyncContext } from "node-sass";
import { LegacyImporterThis, LegacySyncImporter } from "sass";
import { aliasImporter, customImporters } from "../../lib/sass/importer.js";
import { jest } from "@jest/globals";

// SASS importers receive two other arguments that this package doesn't care about.
// Fake `this` which the type definitions both define for importers.
const fakeImporterThis = {} as LegacyImporterThis & SyncContext;
const fakePrev = "";

describe("#aliasImporter", () => {
  it("should create an importer to replace aliases and otherwise return null", () => {
    const importer = aliasImporter({
      aliases: { input: "output", "~alias": "node_modules" },
      aliasPrefixes: {},
    });

    expect(importer.call(fakeImporterThis, "input", fakePrev)).toEqual({
      file: "output",
    });
    expect(importer.call(fakeImporterThis, "~alias", fakePrev)).toEqual({
      file: "node_modules",
    });
    expect(importer.call(fakeImporterThis, "output", fakePrev)).toBeNull();
    expect(
      importer.call(fakeImporterThis, "input-substring", fakePrev)
    ).toBeNull();
    expect(importer.call(fakeImporterThis, "other", fakePrev)).toBeNull();
  });

  it("should create an importer to replace alias prefixes and otherwise return null", () => {
    const importer = aliasImporter({
      aliases: {},
      aliasPrefixes: { "~": "node_modules/", abc: "def" },
    });

    expect(importer.call(fakeImporterThis, "abc-123", fakePrev)).toEqual({
      file: "def-123",
    });
    expect(importer.call(fakeImporterThis, "~package", fakePrev)).toEqual({
      file: "node_modules/package",
    });
    expect(importer.call(fakeImporterThis, "output~", fakePrev)).toBeNull();
    expect(
      importer.call(fakeImporterThis, "input-substring-abc", fakePrev)
    ).toBeNull();
    expect(importer.call(fakeImporterThis, "other", fakePrev)).toBeNull();
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
    expect(aliasImporter.call(fakeImporterThis, "~package", fakePrev)).toEqual({
      file: "node_modules/package",
    });
    expect(aliasImporter.call(fakeImporterThis, "~alias", fakePrev)).toEqual({
      file: "secret/path",
    });
    expect(aliasImporter.call(fakeImporterThis, "other", fakePrev)).toBeNull();
  });

  it("should add additional importers if passed a function", () => {
    const importer = jest.fn<LegacySyncImporter>();

    const importers = customImporters({
      aliases: {},
      aliasPrefixes: {},
      importer,
    });

    expect(importers).toHaveLength(2);
    expect(importers[1]).toEqual(importer);
  });

  it("should add multiple importers if passed an array", () => {
    const importer1 = jest.fn<LegacySyncImporter>();
    const importer2 = jest.fn<LegacySyncImporter>();
    const importer3 = jest.fn<LegacySyncImporter>();

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
