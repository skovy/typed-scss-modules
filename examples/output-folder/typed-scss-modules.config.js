export const config = {
  // Note: you likely would only need `__generated`.
  // This example includes `examples/output-folder` because it's nested within a project.
  outputFolder: "__generated__/examples/output-folder",
  // `.d.ts` is always appended because that's the only valid output extension.
  outputFilename: (filename) => `${filename}.gen`,
};
