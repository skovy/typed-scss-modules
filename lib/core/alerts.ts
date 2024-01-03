import chalk from "chalk";
import { SassError } from "node-sass";

export const LOG_LEVELS = ["verbose", "error", "info", "silent"] as const;
export type LogLevel = (typeof LOG_LEVELS)[number];

export const logLevelDefault: LogLevel = "verbose";

let currentLogLevel: LogLevel | undefined;

export const setAlertsLogLevel = (logLevel: LogLevel) => {
  currentLogLevel = logLevel;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CbFunc = (...args: any[]) => void;
type WrappedCbFunc<T extends CbFunc> = (
  ...args: Parameters<T>
) => ReturnType<T> | void;
/**
 * wraps a callback and only calls it if currentLogLevel is undefined or included in permittedLogLevels
 * @param permittedLogLevels list of log levels. callbacks will only be called if current log level is listed here
 * @param cb callback
 */
const withLogLevelsRestriction =
  <T extends CbFunc>(permittedLogLevels: LogLevel[], cb: T): WrappedCbFunc<T> =>
  (...args: Parameters<T>): ReturnType<T> | void => {
    const shouldCall =
      !currentLogLevel || permittedLogLevels.includes(currentLogLevel);

    if (shouldCall) {
      return cb(...args);
    }
  };

const normalizeErrorMessage = (error: string | Error) => {
  if (error && error instanceof Error) {
    if ("file" in error) {
      const { message, file, line, column } = error as SassError;
      const location = file ? ` (${file}[${line}:${column}])` : "";
      const wrappedError = new Error(`SASS Error ${location}\n${message}`, {
        cause: error,
      });

      wrappedError.stack = chalk.red(wrappedError.stack);

      return wrappedError;
    }

    const wrappedError = new Error(error.message);
    wrappedError.stack = chalk.red(error.stack);
    return wrappedError;
  }

  return chalk.red(error);
};
const error = withLogLevelsRestriction(
  ["verbose", "error", "info"],
  (message: string | Error) => {
    console.warn(normalizeErrorMessage(message));
  }
);
const warn = withLogLevelsRestriction(["verbose"], (message: string) =>
  console.warn(chalk.yellowBright(message))
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
