import { LegacySyncImporter } from "sass";
import { SyncImporter } from "node-sass";

// Hacky way to merge both dart-sass and node-sass importer definitions.
type Importer = LegacySyncImporter & SyncImporter;

export { Importer };

export interface Aliases {
  [index: string]: string;
}

interface AliasImporterOptions {
  aliases: Aliases;
  aliasPrefixes: Aliases;
}

/**
 * Construct a SASS importer to create aliases for imports.
 */
export const aliasImporter =
  ({ aliases, aliasPrefixes }: AliasImporterOptions): Importer =>
  (url: string) => {
    if (url in aliases) {
      const file = aliases[url];

      return {
        file,
      };
    }

    const prefixMatch = Object.keys(aliasPrefixes).find((prefix) =>
      url.startsWith(prefix)
    );

    if (prefixMatch) {
      return {
        file: aliasPrefixes[prefixMatch] + url.substr(prefixMatch.length),
      };
    }

    return null;
  };

export interface SASSImporterOptions {
  aliases?: Aliases;
  aliasPrefixes?: Aliases;
  importer?: Importer | Importer[];
}

/**
 * Construct custom SASS importers based on options.
 *
 *  - Given aliases and alias prefix options, add a custom alias importer.
 *  - Given custom SASS importer(s), append to the list of importers.
 */
export const customImporters = ({
  aliases = {},
  aliasPrefixes = {},
  importer,
}: SASSImporterOptions): Importer[] => {
  const importers: Importer[] = [aliasImporter({ aliases, aliasPrefixes })];

  if (typeof importer === "function") {
    importers.push(importer);
  } else if (Array.isArray(importer)) {
    importers.push(...importer);
  }

  return importers;
};
