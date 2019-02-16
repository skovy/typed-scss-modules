import { Options } from "../sass";
import { ExportType } from "../typescript";

export interface MainOptions extends Options {
  exportType: ExportType;
  watch: boolean;
}
