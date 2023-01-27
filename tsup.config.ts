import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["lib/**.ts"],
  minify: true,
  dts: true,
  format: "esm",
});
