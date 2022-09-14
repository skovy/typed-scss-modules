# 🎁 typed-scss-modules

[![Build Status](https://travis-ci.com/skovy/typed-scss-modules.svg?branch=master)](https://travis-ci.com/skovy/typed-scss-modules)
[![npm version](https://img.shields.io/npm/v/typed-scss-modules.svg?style=flat)](https://www.npmjs.com/package/typed-scss-modules)

Generate TypeScript definitions (`.d.ts`) files for CSS Modules that are written in SCSS (`.scss`). Check out [this post to learn more](https://skovy.dev/generating-typescript-definitions-for-css-modules-using-sass/) about the rationale and inspiration behind this package.

![Example](/docs/typed-scss-modules-example.gif)

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

Install and run as a `devDependency`:

```bash
yarn add -D typed-scss-modules
yarn typed-scss-modules src
```

Or, install globally:

```bash
yarn global add typed-scss-modules
typed-scss-modules src
```

Or, with npm:

```bash
npm install -D typed-scss-modules
npx typed-scss-modules src
```

## CLI Options

For all possible commands, run `typed-scss-modules --help`.

The only required argument is the directory where all SCSS files are located. Running `typed-scss-modules src` will search for all files matching `src/**/*.scss`. This can be overridden by providing a [glob](https://github.com/isaacs/node-glob#glob-primer) pattern instead of a directory. For example, `typed-scss-modules src/*.scss`

### `--watch` (`-w`)

- **Type**: `boolean`
- **Default**: `false`
- **Example**: `typed-scss-modules src --watch`

Watch for files that get added or are changed and generate the corresponding type definitions.

### `--ignoreInitial`

- **Type**: `boolean`
- **Default**: `false`
- **Example**: `typed-scss-modules src --watch --ignoreInitial`

Skips the initial build when passing the watch flag. Use this when running concurrently with another watch, but the initial build should happen first. You would run without watch first, then start off the concurrent runs after.

### `--ignore`

- **Type**: `string[]`
- **Default**: `[]`
- **Example**: `typed-scss-modules src --watch --ignore "**/secret.scss"`

A pattern or an array of glob patterns to exclude files that match and avoid generating type definitions.

### `--includePaths` (`-i`)

- **Type**: `string[]`
- **Default**: `[]`
- **Example**: `typed-scss-modules src --includePaths src/core`

An array of paths to look in to attempt to resolve your `@import` declarations. This example will search the `src/core` directory when resolving imports.

### `--implementation`

- **Type**: `"node-sass" | "sass"`
- **Default**: If an option is passed, it will always use the provided package implementation. If an option is not passed, it will first check if `node-sass` is installed. If it is, it will be used. Otherwise, it will then check if `sass` is installed. If it is, it will be used. Finally, falling back to `node-sass` if all checks and validations fail.
- **Example**: `typed-scss-modules src --implementation sass`

### `--aliases` (`-a`)

- **Type**: `object`
- **Default**: `{}`
- **Example**: `typed-scss-modules src --aliases.~some-alias src/core/variables`

An object of aliases to map to their corresponding paths. This example will replace any `@import '~alias'` with `@import 'src/core/variables'`.

### `--aliasPrefixes` (`-p`)

- **Type**: `object`
- **Default**: `{}`
- **Example**: `typed-scss-modules src --aliasPrefixes.~ node_modules/`

An object of prefix strings to replace with their corresponding paths. This example will replace any `@import '~bootstrap/lib/bootstrap'` with `@import 'node_modules/bootstrap/lib/bootstrap'`.
This matches the common use-case for importing scss files from node_modules when `sass-loader` will be used with `webpack` to compile the project.

### `--nameFormat` (`-n`)

- **Type**: `"all" | "camel" | "kebab" | "param" | "snake" | "dashes" | "none"`
- **Default**: `"camel"`
- **Examples**:
  - `typed-scss-modules src --nameFormat camel`
  - `typed-scss-modules src --nameFormat kebab --nameFormat dashes --exportType default`. In order to use multiple formatters, you must use `--exportType default`.

The class naming format to use when converting the classes to type definitions.

- **all**: makes use of all formatters (except `all` and `none`) and converts all class names to their respective formats, with no duplication. In order to use this option, you must use `--exportType default`.
- **camel**: convert all class names to camel-case, e.g. `App-Logo` => `appLogo`.
- **kebab**/**param**: convert all class names to kebab/param case, e.g. `App-Logo` => `app-logo` (all lower case with '-' separators).
- **dashes**: only convert class names containing dashes to camel-case, leave others alone, e.g. `App` => `App`, `App-Logo` => `appLogo`. Matches the webpack [css-loader camelCase 'dashesOnly'](https://github.com/webpack-contrib/css-loader#camelcase) option.
- **snake**: convert all class names to lower case with underscores between words.
- **none**: do not modify the given class names (you should use `--exportType default` when using `--nameFormat none` as any classes with a `-` in them are invalid as normal variable names).
  Note: If you are using create-react-app v2.x and have NOT ejected, `--nameFormat none --exportType default` matches the class names that are generated in CRA's webpack's config.

### `--listDifferent` (`-l`)

- **Type**: `boolean`
- **Default**: `false`
- **Example**: `typed-scss-modules src --listDifferent`

List any type definition files that are different than those that would be generated. If any are different, exit with a status code `1`.

### `--exportType` (`-e`)

- **Type**: `"named" | "default"`
- **Default**: `"named"`
- **Example**: `typed-scss-modules src --exportType default`

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
export type Styles = {
  text: string;
  textHighlighted: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
```

This export type is useful when using kebab (param) cased class names since variables with a `-` are not valid variables and will produce invalid types or when a class name is a TypeScript keyword (eg: `while` or `delete`). Additionally, the `Styles` and `ClassNames` types are exported which can be useful for properly typing variables, functions, etc. when working with dynamic class names.

### `--exportTypeName`

- **Type**: `string`
- **Default**: `"ClassNames"`
- **Example**: `typed-scss-modules src --exportType default --exportTypeName ClassesType`

Customize the type name exported in the generated file when `--exportType` is set to `"default"`.
Only default exports are affected by this command. This example will change the export type line to:

```typescript
export type ClassesType = keyof Styles;
```

### `--exportTypeInterface`

- **Type**: `string`
- **Default**: `"Styles"`
- **Example**: `typed-scss-modules src --exportType default --exportTypeInterface IStyles`

Customize the interface name exported in the generated file when `--exportType` is set to `"default"`.
Only default exports are affected by this command. This example will change the export interface line to:

```typescript
export type IStyles = {
  // ...
};
```

### `--quoteType` (`-q`)

- **Type**: `"single" | "double"`
- **Default**: `"single"`
- **Example**: `typed-scss-modules src --exportType default --quoteType double`

Specify a quote type to match your TypeScript configuration. Only default exports are affected by this command. This example will wrap class names with double quotes ("). If [Prettier](https://prettier.io) is installed and configured in the project, it will be used and is likely to override the effect of this setting.

### `--updateStaleOnly` (`-u`)

- **Type**: `boolean`
- **Default**: `false`
- **Example**: `typed-scss-modules src --updateStaleOnly`

Overwrite generated files only if the source file has more recent changes. This can be useful if you want to avoid extraneous file updates, which can cause watcher processes to trigger unnecessarily (e.g. `tsc --watch`).

Caveat: If a generated type definition file is updated manually, it won't be re-generated until the corresponding scss file is also updated.

### `--logLevel` (`-L`)

- **Type**: `"verbose" | "error" | "info" | "silent"`
- **Default**: `"verbose"`
- **Example**: `typed-scss-modules src --logLevel error`

Sets verbosity level of console output.

#### `verbose`

Print all messages

#### `error`

Print only errors

#### `info`

Print only some messages

#### `silent`

Print nothing

### `--banner`

- **Type**: `string`
- **Default**: `undefined`
- **Example**: `typed-scss-modules src --banner '// This is an example banner\n'`

Will prepend a string to the top of your output files

```typescript
// This is an example banner
export type Styles = {
  // ...
};
```

### `--outputFolder` (`-o`)

- **Type**: `string`
- **Default**: _none_
- **Example**: `typed-scss-modules src --outputFolder __generated__`

Set a relative folder to output the generated type definitions. Instead of writing the type definitions directly next to each SCSS module (sibling file), it will write to the output folder with the same path.

It will use the relative path to the SCSS module from where this tool is executed. This same path (including any directories) will be constructed in the output folder. This is important for this to work properly with TypeScript.

**Important**: for this to work as expected the `tsconfig.json` needs to have [`rootDirs`](https://www.typescriptlang.org/tsconfig#rootDirs) added with the same output folder. This will allow TypeScript to pick up these type definitions and map them to the actual SCSS modules.

```json
{
  "compilerOptions": {
    "rootDirs": [".", "__generated__"]
  }
}
```

### `--additionalData` (`-d`)

- **Type**: `string`
- **Default**: _none_
- **Example**: `typed-scss-modules src --additionalData '$global-var: green;'`

Prepend the provided SCSS code before each file. This is useful for injecting globals into every file, such as adding an import to load global variables for each file.

## Config options

All options above are also supported as a configuration file in the root of the project. The following configuration file names are supported:

- `typed-scss-modules.config.ts`
- `typed-scss-modules.config.js`

The file can provide either a named `config` export or a default export.

```js
// Example of a named export with some of the options sets.
export const config = {
  banner: "// customer banner",
  exportType: "default",
  exportTypeName: "TheClasses",
  logLevel: "error",
};

// Example of a default export with some of the options sets.
export default {
  banner: "// customer banner",
  exportType: "default",
  exportTypeName: "TheClasses",
  logLevel: "error",
};
```

> Note: the configuration options are the same as the CLI options without the leading dashes (`--`). Only the full option name is supported (not aliases) in the configuration file.

CLI options will take precedence over configuration file options.

In addition to all CLI options, the following are options only available with the configuration file:

### `importer`

- **Type**: `Importer | Importer[]`
- **Default**: _none_

Define a [single custom SASS importer or an array of SASS importers](https://github.com/sass/sass/blob/f355f602fc15f55b0a0a795ebe6eb819963e08a5/js-api-doc/legacy/importer.d.ts#L51-L149). This should only be necessary if custom SASS importers are already being used in the build process. This is used internally to implement `aliases` and `aliasPrefixes`.

Refer to [`lib/sass/importer.ts`](/blob/master/lib/sass/importer.ts) for more details and the `node-sass` and `sass` importer type definitions.

## Examples

For examples of how this tool can be used and configured, see the `examples` directory:

- [Basic example](/examples/basic)
- [Default export example](/examples/default-export)
- [Config file (with custom importer) example](/examples/config-file)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/dawnmist"><img src="https://avatars3.githubusercontent.com/u/5810277?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Janeene Beeforth</b></sub></a><br /><a href="https://github.com/skovy/typed-scss-modules/issues?q=author%3Adawnmist" title="Bug reports">🐛</a> <a href="https://github.com/skovy/typed-scss-modules/commits?author=dawnmist" title="Code">💻</a> <a href="https://github.com/skovy/typed-scss-modules/commits?author=dawnmist" title="Documentation">📖</a></td>
      <td align="center"><a href="https://github.com/ericbf"><img src="https://avatars0.githubusercontent.com/u/2483476?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Eric Ferreira</b></sub></a><br /><a href="https://github.com/skovy/typed-scss-modules/commits?author=ericbf" title="Code">💻</a> <a href="https://github.com/skovy/typed-scss-modules/commits?author=ericbf" title="Documentation">📖</a></td>
      <td align="center"><a href="https://github.com/lkarmelo"><img src="https://avatars2.githubusercontent.com/u/20393808?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Luis Lopes</b></sub></a><br /><a href="https://github.com/skovy/typed-scss-modules/commits?author=lkarmelo" title="Code">💻</a></td>
      <td align="center"><a href="https://nostalg.io"><img src="https://avatars0.githubusercontent.com/u/5139752?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Josh Wedekind</b></sub></a><br /><a href="https://github.com/skovy/typed-scss-modules/commits?author=halfnibble" title="Code">💻</a> <a href="https://github.com/skovy/typed-scss-modules/commits?author=halfnibble" title="Documentation">📖</a> <a href="https://github.com/skovy/typed-scss-modules/commits?author=halfnibble" title="Tests">⚠️</a></td>
      <td align="center"><a href="https://github.com/peanutbother"><img src="https://avatars3.githubusercontent.com/u/6437182?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jared Gesser</b></sub></a><br /><a href="#ideas-peanutbother" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center"><a href="https://github.com/raphael-leger"><img src="https://avatars1.githubusercontent.com/u/12732777?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Raphaël L</b></sub></a><br /><a href="https://github.com/skovy/typed-scss-modules/commits?author=raphael-leger" title="Code">💻</a> <a href="#ideas-raphael-leger" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center"><a href="https://NickTheSick.com"><img src="https://avatars1.githubusercontent.com/u/1852538?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Nick Perez</b></sub></a><br /><a href="https://github.com/skovy/typed-scss-modules/issues?q=author%3Anperez0111" title="Bug reports">🐛</a> <a href="https://github.com/skovy/typed-scss-modules/commits?author=nperez0111" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center"><a href="https://alander.org"><img src="https://avatars3.githubusercontent.com/u/1771462?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Even Alander</b></sub></a><br /><a href="https://github.com/skovy/typed-scss-modules/commits?author=deificx" title="Code">💻</a> <a href="https://github.com/skovy/typed-scss-modules/commits?author=deificx" title="Tests">⚠️</a> <a href="#ideas-deificx" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center"><a href="http://inkblotty.github.io"><img src="https://avatars3.githubusercontent.com/u/14206003?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Katie Foster</b></sub></a><br /><a href="https://github.com/skovy/typed-scss-modules/commits?author=inkblotty" title="Code">💻</a> <a href="https://github.com/skovy/typed-scss-modules/commits?author=inkblotty" title="Tests">⚠️</a> <a href="https://github.com/skovy/typed-scss-modules/commits?author=inkblotty" title="Documentation">📖</a></td>
      <td align="center"><a href="https://github.com/ccortezaguilera"><img src="https://avatars3.githubusercontent.com/u/10718803?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Carlos Aguilera</b></sub></a><br /><a href="https://github.com/skovy/typed-scss-modules/commits?author=ccortezaguilera" title="Code">💻</a></td>
      <td align="center"><a href="https://github.com/craigrmccown"><img src="https://avatars1.githubusercontent.com/u/2373979?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Craig McCown</b></sub></a><br /><a href="#ideas-craigrmccown" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/skovy/typed-scss-modules/commits?author=craigrmccown" title="Code">💻</a> <a href="https://github.com/skovy/typed-scss-modules/commits?author=craigrmccown" title="Tests">⚠️</a> <a href="https://github.com/skovy/typed-scss-modules/commits?author=craigrmccown" title="Documentation">📖</a></td>
      <td align="center"><a href="https://github.com/capsuleman"><img src="https://avatars.githubusercontent.com/u/34281913?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Guillaume Vagner</b></sub></a><br /><a href="https://github.com/skovy/typed-scss-modules/commits?author=capsuleman" title="Code">💻</a> <a href="https://github.com/skovy/typed-scss-modules/commits?author=capsuleman" title="Tests">⚠️</a> <a href="https://github.com/skovy/typed-scss-modules/issues?q=author%3Acapsuleman" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://dev.to/srmagura"><img src="https://avatars.githubusercontent.com/u/801549?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sam Magura</b></sub></a><br /><a href="https://github.com/skovy/typed-scss-modules/commits?author=srmagura" title="Code">💻</a> <a href="https://github.com/skovy/typed-scss-modules/commits?author=srmagura" title="Tests">⚠️</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## Alternatives

This package was heavily influenced on [typed-css-modules](https://github.com/Quramy/typed-css-modules) which generates TypeScript definitions (`.d.ts`) files for CSS Modules that are written in CSS (`.css`).

This package is currently used as a CLI. There are also [packages that generate types as a webpack loader](https://github.com/Jimdo/typings-for-css-modules-loader).
