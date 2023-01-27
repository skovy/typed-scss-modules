import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["lib/**.ts"],
  minify: true,
  dts: true,
  format: "esm",
  esbuildOptions(options, context) {
    options.legalComments = "none";
  },
});
