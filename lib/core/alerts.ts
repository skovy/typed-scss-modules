import chalk from "chalk";
import { MainOptions, SlimOptions } from "./types";
import { AlertLogLevel, LogLevel } from "lib/typescript";

const checkLogLevel = (
  logLevel: LogLevel,
  requiredLevel: AlertLogLevel
): boolean => {
  switch (logLevel) {
    case "verbose":
      return true;
    case "info":
      return requiredLevel !== "notice";
    case "minimal":
      return requiredLevel !== "notice" && requiredLevel !== "info";
    case "error":
      return (
        requiredLevel !== "notice" &&
        requiredLevel !== "info" &&
        requiredLevel !== "success"
      );
    default:
      return false;
  }
};
type noOpFn = () => void;
type callbackFn = () => any;
const stubLog = <T = callbackFn>(enabled: boolean, fn: T): T | noOpFn => {
  const noOp = () => {};
  return enabled ? fn : noOp;
};

const error = (message: string) => console.log(chalk.red(message));
const warn = (message: string) => console.log(chalk.yellowBright(message));
const notice = (message: string) => console.log(chalk.gray(message));
const info = (message: string) => console.log(chalk.blueBright(message));
const success = (message: string) => console.log(chalk.green(message));

export const alerts = (options: MainOptions | SlimOptions) => ({
  error: stubLog(checkLogLevel(options.logLevel, "error"), error),
  warn: stubLog(checkLogLevel(options.logLevel, "warn"), warn),
  notice: stubLog(checkLogLevel(options.logLevel, "notice"), notice),
  info: stubLog(checkLogLevel(options.logLevel, "info"), info),
  success: stubLog(checkLogLevel(options.logLevel, "success"), success)
});
