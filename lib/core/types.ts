import { SASSOptions } from "../sass";
import { ExportType, QuoteType, LogLevel } from "../typescript";

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
  outputFolder?: string;
  outputFile?(file: string): string;
}

export interface ConfigOptions extends CLIOptions, SASSOptions {}
