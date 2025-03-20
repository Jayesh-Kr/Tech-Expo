const chalk = require('chalk');

const logger = {
  log: (message) => {
    console.log(chalk.white(`[INFO] ${message}`));
  },
  success: (message) => {
    console.log(chalk.green(`[SUCCESS] ${message}`));
  },
  warn: (message) => {
    console.log(chalk.yellow(`[WARNING] ${message}`));
  },
  error: (message) => {
    console.log(chalk.red(`[ERROR] ${message}`));
  },
  title: (message) => {
    console.log(chalk.bold.blue(`\n${message}`));
    console.log(chalk.bold.blue("=".repeat(message.length)));
  },
  data: (message) => {
    console.log(chalk.cyan(`[DATA] ${message}`));
  }
};

module.exports = logger;