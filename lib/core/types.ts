import { Options } from "../sass";
import { ExportType } from "../typescript";

export interface MainOptions extends Options {
  ignore: string[];
  exportType: ExportType;
  listDifferent: boolean;
  watch: boolean;
  ignoreInitial: boolean;
}
