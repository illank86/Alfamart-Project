'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var defaultConfig = {
    PORT: process.env.PORT || 8000
};

var config = {
    DB_URL: 'us-cdbr-iron-east-05.cleardb.net',
    DB_PASS: '714c3527'
};

exports.default = _extends({}, defaultConfig, config);