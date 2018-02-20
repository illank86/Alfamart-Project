'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = _mysql2.default.createPool({
    host: _constants2.default.DB_URL,
    user: process.env.DB_USERNAME || 'root',
    password: _constants2.default.DB_PASS,
    database: process.env.DB_NAME || 'alfamart'
});

exports.default = db;