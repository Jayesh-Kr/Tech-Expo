const chalk = require('chalk');

const logger = {
  log: (message) => {
    console.log(chalk.cyan(`[INFO] ${message}`));
  },
  success: (message) => {
    console.log(chalk.greenBright(`[SUCCESS] ${message}`));
  },
  warn: (message) => {
    console.log(chalk.yellowBright(`[WARNING] ${message}`));
  },
  error: (message) => {
    console.log(chalk.redBright(`[ERROR] ${message}`));
  },
  title: (message) => {
    console.log(chalk.bold.magenta(`\n${message}`));
    console.log(chalk.bold.magenta("=".repeat(message.length)));
  },
  data: (message) => {
    console.log(chalk.blueBright(`[DATA] ${message}`));
  },
  ping: (message) => {
    console.log(chalk.hex('#00FFFF')(`[PING] ${message}`));
  },
  network: (message) => {
    console.log(chalk.hex('#FF00FF')(`[NETWORK] ${message}`));
  }
};

module.exports = logger;