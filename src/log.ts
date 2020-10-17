import chalk from "chalk";

export const error = (msg: string) => {console.log(chalk.bold.red(msg))};
export const warning = (msg: string) => {console.log(chalk.keyword('orange'))}