import { SASSOptions } from "../sass/index.js";
import { ExportType, LogLevel, QuoteType } from "../typescript/index.js";

type CLIOnlyOptions = Extract<keyof SASSOptions, "importer">;

export interface CLIOptions extends Exclude<SASSOptions, CLIOnlyOptions> {
  banner: string;
  ignore: string[];
  ignoreInitial: boolean;
  exportType: ExportType;
  exportTypeName: string;
  exportTypeInterface: string;
  listDifferent: boolean;
  quoteType: QuoteType;
  updateStaleOnly: boolean;
  watch: boolean;
  logLevel: LogLevel;
  outputFolder: string | null;
}

export interface ConfigOptions extends CLIOptions, SASSOptions {}
