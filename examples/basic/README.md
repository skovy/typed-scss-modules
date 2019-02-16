# Basic Example

This example contains:

- Core variables (`core/variables.scss`) which contains things like colors, etc. To make the import of these variables easier, it's expected that this directory is included in the search path. This demonstrates the need for `includePaths`.
- An alias. This is most common when using a [webpack alias](https://webpack.js.org/configuration/resolve/#resolve-alias). This demonstrates the need for `aliases`.

The command to generate the proper type files would look like this (_in the root of this repository_):

```bash
yarn tsm "examples/basic/**/*.scss" --includePaths examples/basic/core --aliases.~alias variables
```

- The glob pattern is wrapped in quotes to pass it as a string and avoid executing.
- `includePaths` with `examples/basic/core` so that `@import 'variables'` is found.
- `aliases` with `~alias: variables` meaning any `@import '~alias'` resolves to `@import 'variables'`.
- No file will be output for `variables.scss` since there are no classes.
