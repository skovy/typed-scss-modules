import { SASSOptions } from "../sass";
import { ExportType, LogLevel, QuoteType } from "../typescript";

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
  allowArbitraryExtensions: boolean;
}

export interface ConfigOptions extends CLIOptions, SASSOptions {}
