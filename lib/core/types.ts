import { Options } from "../sass";
import { ExportType, LogLevel } from "../typescript";

export interface MainOptions extends Options {
  exportType: ExportType;
  listDifferent: boolean;
  watch: boolean;
  watchTimeout: number;
  ignoreInitial: boolean;
  logLevel: LogLevel;
}
export interface SlimOptions extends Options {
  exportType: ExportType;
  logLevel: LogLevel;
}
