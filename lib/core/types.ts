import { Options } from "../sass";
import { ExportType, QuoteType, LogLevel } from "../typescript";

export interface MainOptions extends Options {
  ignore: string[];
  ignoreInitial: boolean;
  exportType: ExportType;
  exportTypeName: string;
  exportTypeInterface: string;
  listDifferent: boolean;
  quoteType: QuoteType;
  watch: boolean;
  logLevel: LogLevel;
}
