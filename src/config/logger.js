import winston from 'winston';
import path, { dirname } from 'path';
import moment from 'moment';

const MESSAGE = Symbol.for('message');


const jsonFormatter = (logEntry) => {
  const base = { timestamp:  moment(new Date()).format("YYYY-MM-DD HH:mm:ss") };
  const json = Object.assign(base, logEntry)
  logEntry[MESSAGE] = JSON.stringify(json);
  return logEntry;
}


const logger = winston.createLogger({
    level: 'info',
    format: winston.format(jsonFormatter)(),
    transports: [
      new winston.transports.File({ filename:  path.join(__dirname, '../../logs', '/error.log'), level: 'error' }),
      new winston.transports.File({ filename: path.join(__dirname, '../../logs', '/combine.log')})
    ]
  });
  

  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple()
    }));
  };

  export default logger;