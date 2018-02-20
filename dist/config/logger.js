'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MESSAGE = Symbol.for('message');

var jsonFormatter = function jsonFormatter(logEntry) {
  var base = { timestamp: (0, _moment2.default)(new Date()).format("YYYY-MM-DD HH:mm:ss") };
  var json = Object.assign(base, logEntry);
  logEntry[MESSAGE] = JSON.stringify(json);
  return logEntry;
};

var logger = _winston2.default.createLogger({
  level: 'info',
  format: _winston2.default.format(jsonFormatter)(),
  transports: [new _winston2.default.transports.File({ filename: _path2.default.join(__dirname, '../../logs', '/error.log'), level: 'error' }), new _winston2.default.transports.File({ filename: _path2.default.join(__dirname, '../../logs', '/combine.log') })]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new _winston2.default.transports.Console({
    format: _winston2.default.format.simple()
  }));
};

exports.default = logger;