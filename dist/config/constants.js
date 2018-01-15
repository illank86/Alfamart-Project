'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var defaultConfig = {
    PORT: process.env.PORT || 8000
};

var config = {
    DB_URL: 'localhost',
    DB_PASS: 'password'
};

exports.default = _extends({}, defaultConfig, config);