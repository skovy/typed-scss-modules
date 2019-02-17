import chalk from "chalk";

const error = (message: string) => console.log(chalk.red(message));
const warn = (message: string) => console.log(chalk.yellowBright(message));
const notice = (message: string) => console.log(chalk.gray(message));
const info = (message: string) => console.log(chalk.blueBright(message));
const success = (message: string) => console.log(chalk.green(message));

export const alerts = { error, warn, notice, info, success };
