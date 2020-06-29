import chalk from "chalk";

export const LOG_LEVELS = ["verbose", "error", "info", "silent"] as const;
export type LogLevel = typeof LOG_LEVELS[number];

export const logLevelDefault: LogLevel = "verbose";

let currentLogLevel: LogLevel | undefined;

export const setAlertsLogLevel = (logLevel: LogLevel) => {
  currentLogLevel = logLevel;
};

type CbFunc = (...args: any) => any;
type WrappedCbFunc<T extends CbFunc> = (
  ...args: Parameters<T>
) => ReturnType<T> | void;
/**
 * wraps a callback and only calls it if currentLogLevel is undefined or included in permittedLogLevels
 * @param permittedLogLevels list of log levels. callbacks will only be called if current log level is listed here
 * @param cb callback
 */
const withLogLevelsRestriction = <T extends CbFunc>(
  permittedLogLevels: LogLevel[],
  cb: T
): WrappedCbFunc<T> => (...args: Parameters<T>): ReturnType<T> | void => {
  const shouldCall =
    !currentLogLevel || permittedLogLevels.includes(currentLogLevel);

  if (shouldCall) {
    return cb(...args);
  }
};

const error = withLogLevelsRestriction(
  ["verbose", "error", "info"],
  (message: string) => console.log(chalk.red(message))
);
const warn = withLogLevelsRestriction(["verbose"], (message: string) =>
  console.log(chalk.yellowBright(message))
);
const notice = withLogLevelsRestriction(
  ["verbose", "info"],
  (message: string) => console.log(chalk.gray(message))
);
const info = withLogLevelsRestriction(["verbose", "info"], (message: string) =>
  console.log(chalk.blueBright(message))
);
const success = withLogLevelsRestriction(
  ["verbose", "info"],
  (message: string) => console.log(chalk.green(message))
);

export const alerts = { error, warn, notice, info, success };
