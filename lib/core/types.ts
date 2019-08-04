import { Options } from "../sass";
import { ExportType } from "../typescript";

export interface MainOptions extends Options {
  exportType: ExportType;
  listDifferent: boolean;
  watch: boolean;
  ignoreInitial: boolean;
}
