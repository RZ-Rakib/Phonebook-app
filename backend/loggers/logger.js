const { createLogger, format, transports } = require('winston');

const logFormat = format.combine(
  format.timestamp({
    format: () => new Date().toLocaleString('fi-FI', {
      timeZone: 'Europe/Helsinki',
      hour12: false
    })
  }),
  format.json()
);

const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp({
    format: () => new Date().toLocaleString('fi-FI', {
      timeZone: 'Europe/Helsinki',
      hour12: false
    })
  }),
  format.printf(({ level, message, timestamp }) =>
    `${level}: ${message}  [${timestamp}]`
  )
);

const logger = createLogger({
  level: 'info',
  transports: [
    //Console: colorized and readable
    new transports.Console({ format: consoleFormat }),

    //file: clean JSON for parsing or production logs
    new transports.File({ filename: 'logs/combined.log', format: logFormat }),
    new transports.File({ filename: 'logs/errors.log', level: 'error', format: logFormat })
  ]
});

module.exports = logger;