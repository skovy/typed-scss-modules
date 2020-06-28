import { Options } from "../sass";
import { ExportType, QuoteType } from "../typescript";

export interface MainOptions extends Options {
  ignore: string[];
  ignoreInitial: boolean;
  exportType: ExportType;
  exportTypeName: string;
  exportTypeInterface: string;
  listDifferent: boolean;
  header?: string;
  quoteType: QuoteType;
  watch: boolean;
}
