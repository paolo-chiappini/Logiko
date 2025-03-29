const chalk = require("chalk");

class ConsoleLogger {
  constructor(color = "white") {
    this.color = color;
  }

  log(string) {
    console.log(chalk[this.color](string));
  }
}

module.exports = { ConsoleLogger };
