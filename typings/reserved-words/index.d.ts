type Dialect =
  | "es3"
  | 3
  | "es5"
  | 5
  | "es2015"
  | 6
  | "es7"
  | 7
  | "es6"
  | "next";

interface Reserved {
  /**
   * Checks a word for being an reserved word and returns true if provided
   * identifier string is a reserved word in some ECMAScript dialect.
   *
   * @param word word to check
   * @param dialect dialect or version
   * @param strict strict mode additionally checks whether word is a keyword or
   * future reserved word under strict mode.
   */
  check(word: string, dialect?: Dialect, strict?: boolean): boolean;
}

declare module "reserved-words" {
  declare const reserved: Reserved;
  export = reserved;
}
