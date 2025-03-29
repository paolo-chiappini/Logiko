const chalk = require("chalk");

class ConsoleLogger {
  log(string) {
    console.log(chalk.gray(string));
  }
}

module.exports = { ConsoleLogger };
