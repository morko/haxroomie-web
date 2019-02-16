/**
 * @module logging
 */
const { createLogger, format, transports } = require('winston');
const expressWinston = require('express-winston');

let customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4
  },
  colors: { 
    error: 'red',
    warn: 'bold yellow',
    info: 'green',
    verbose: 'cyan',
    debug: 'grey'
  }
};

const alignedWithColorsAndTime = format.combine(
  format.colorize({colors: customLevels.colors}),
  format.timestamp(),
  format.align(),
  format.printf((info) => {
    const { timestamp, level, message, ...args } = info;
    const ts = timestamp.slice(0, 19).replace('T', ' ');
    return `${ts} [${level}]: ${message.trim()} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
  }),
);

const logger = createLogger({
  levels: customLevels.levels,
  format: alignedWithColorsAndTime,
});

let transportOptions;
let environment = process.env.NODE_ENV || '';
switch(environment) {
  case 'development':
    transportOptions = {level: 'debug'};
    break;
  case 'test':
    transportOptions = {silent: true};
    break;
  default:
    transportOptions = {level: 'info'};
    break;
}
logger.add(new transports.Console(transportOptions));

/**
 * Instance of express-winston logger middleware. Logs all incoming HTTP
 * requests.
 *
 * @external expressWinstonLogger
 * @see {@link https://github.com/bithavoc/express-winston#readme|express-winston}
 */

function createExpressLogger() {
  return expressWinston.logger({
    winstonInstance: logger,
    level: 'debug',
    colorize: true
  });
}

/**
 * Instance of express-winston logger middleware. Logs express errors.
 *
 * @external expressWinstonErrorLogger
 * @see {@link https://github.com/bithavoc/express-winston#readme|express-winston}
 */

function createExpressErrorLogger() {
  return expressWinston.errorLogger({
    winstonInstance: logger,
    level: 'error'
  });
}

module.exports = {
  logger: logger,
  expressLogger: createExpressLogger(),
  expressErrorLogger: createExpressErrorLogger()
};

