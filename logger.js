const chalk = require('chalk');
const log4js = require('log4js');
const fs = require('fs');
const path = require('path');
const timestamp = require('time-stamp');

const LOGS_DIR = './logs';
const CREATED_AT = timestamp('DD-MM-YYYY_HH-mm-ss');

// Initialize logs
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR);
}

log4js.configure({
  appenders: {
    application: {
      type: 'file',
      filename: `./logs/${CREATED_AT}`,
    },
  },
  categories: {
    default: {
      appenders: ['application'],
      level: 'debug',
    },
  },
});

const fileLogger = log4js.getLogger();

module.exports = {
  saveToLog: true,
  createdAt: CREATED_AT,
  info(message) {
    console.log(chalk.bold.blue('[Info]') + chalk.reset(' ' + message));
    this.writeOut('[Info] ' + message);
  },
  warn(message) {
    console.log(chalk.bold.yellow('[Warn]') + chalk.reset(' ' + message));
    this.writeOut('[Warn] ' + message);
  },
  fail(message) {
    console.log(
      chalk.bold.bgRed.white('[Error]') + chalk.reset.bold(' ' + message),
    );
    this.writeOut('[Error] ' + message);
  },
  success(message) {
    console.log(
      chalk.bold.bgGreen.white('[Success]') + chalk.reset.bold(' ' + message),
    );
    this.writeOut('[Success] ' + message);
  },
  writeOut(data) {
    if (!this.saveToLog) return;
    fileLogger.debug(data);
  },
};
