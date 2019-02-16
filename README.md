# 🎁 typed-scss-modules

[![Build Status](https://travis-ci.com/skovy/typed-scss-modules.svg?branch=master)](https://travis-ci.com/skovy/typed-scss-modules)
[![npm version](https://img.shields.io/npm/v/typed-scss-modules.svg?style=flat)](https://www.npmjs.com/package/typed-scss-modules)

Generate TypeScript definitions (`.d.ts`) files for CSS Modules that are written in SCSS (`.scss`).

For example, given the following SCSS:

```scss
@import "variables";

.text {
  color: $blue;

  &-highlighted {
    color: $yellow;
  }
}
```

The following type definitions will be generated:

```typescript
export const text: string;
export const textHighlighted: string;
```

## Basic Usage

Run with npm package runner:

```bash
npx tsm src
```

Or, install globally:

```bash
yarn global add typed-scss-modules
tsm src
```

Or, install and run as a `devDependency`:

```bash
yarn add -D typed-scss-modules
yarn tsm src
```

## Advanced Usage

For all possible commands, run `tsm --help`.

The only required argument is the directoy where all SCSS files are located. Running `tsm src` will search for all files matching `src/**/*.scss`. This can be overridden by providing a [glob](https://github.com/isaacs/node-glob#glob-primer) pattern instead of a directory. For example, `tsm src/*.scss`

### `--includePaths` (`-i`)

- **Type**: `string[]`
- **Default**: `[]`
- **Example**: `tsm src --includePaths src/core`

An array of paths to look in to attempt to resolve your `@import` declarations. This example will search the `src/core` directory when resolving imports.

### `--aliases` (`-a`)

- **Type**: `object`
- **Default**: `{}`
- **Example**: `tsm src --aliases.~some-alias src/core/variables`

An object of aliases to map to their corresponding paths. This example will replace any `@import '~alias'` with `@import 'src/core/variables'`.

### `--nameFormat` (`-n`)

- **Type**: `"camel" | "kebab" | "param"`
- **Default**: `"camel"`
- **Example**: `tsm src --nameFormat camel`

The class naming format to use when converting the classes to type definitions.

### `--exportType` (`-e`)

- **Type**: `"named" | "default"`
- **Default**: `"named"`
- **Example**: `tsm src --exportType default`

The export type to use when generating type definitions.

#### `named`

Given the following SCSS:

```scss
.text {
  color: blue;

  &-highlighted {
    color: yellow;
  }
}
```

The following type definitions will be generated:

```typescript
export const text: string;
export const textHighlighted: string;
```

#### `default`

Given the following SCSS:

```scss
.text {
  color: blue;

  &-highlighted {
    color: yellow;
  }
}
```

The following type definitions will be generated:

```typescript
interface Styles {
  text: string;
  textHighlighted: string;
}

declare const styles: Styles;

export default styles;
```

This export type is useful when using kebab (param) cased class names since variables with a `-` are not valid variables and will produce invalid types or when a class name is a TypeScript keyword (eg: `while` or `delete`)

## Examples

For examples, see the `examples` directory:

- [Basic Example](/examples/basic)
- [Default Export Example](/examples/default-export)

## Alternatives

This package was heavily influenced on [typed-css-modules](https://github.com/Quramy/typed-css-modules) which generates TypeScript definitions (`.d.ts`) files for CSS Modules that are written in CSS (`.css`).

This package is currently used as a CLI. There are also [packages that generate types as a webpack loader](https://github.com/Jimdo/typings-for-css-modules-loader).
