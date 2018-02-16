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
    user: 'b076b71a586ce1',
    password: _constants2.default.DB_PASS,
    database: 'heroku_4b747e7cb16ae71'
});

exports.default = db;