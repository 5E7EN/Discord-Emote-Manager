const { createLogger, format, transports, addColors } = require('winston');
const { combine, colorize, timestamp, printf } = format;
const chalk = require('chalk');

const loggerlevels = {
    colors: {
        info: 'green',
        error: 'underline bold red',
        debug: 'bold magenta',
        warn: 'yellow',
    },
};

const logFormat = printf(({ level, message, timestamp }) => {
    return `${chalk.magenta(timestamp)} [${level}]: ${message}`;
});

module.exports.logger = createLogger({
    format: combine(
        format((info) => {
            info.level = info.level.toUpperCase();
            return info;
        })(),
        timestamp({
            format: 'DD.MM.YY HH:mm:ss.SSS',
        }),
        colorize(),
        logFormat
    ),
    transports: [
        new transports.Console({
            stderrLevels: ['error'],
            colorize: true,
        }),
    ],
});
addColors(loggerlevels.colors);

this.logger.transports[0].level = 'info';

module.exports.info = (...args) => {
    this.logger.info(...args);
};

module.exports.error = (...args) => {
    this.logger.error(...args);
};

module.exports.debug = (...args) => {
    this.logger.debug(...args);
};

module.exports.warn = (...args) => {
    this.logger.warn(...args);
};
