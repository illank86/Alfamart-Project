'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _mqtt = require('mqtt');

var _mqtt2 = _interopRequireDefault(_mqtt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultConfig = {
    PORT: process.env.PORT || 8000
};

var config = {
    DB_URL: 'us-cdbr-iron-east-05.cleardb.net',
    DB_PASS: '714c3527'
};
//
var options = {
    option: {
        port: 1883,
        host: 'mqtt://broker.hivemq.com',
        clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
        // username: 'joywydem',
        // password: 'f1A0bkvykCrl',
        keepalive: 30,
        reconnectPeriod: 3000,
        reschedulePings: true,
        protocolId: 'MQTT',
        protocolVersion: 4,
        connectTimeout: 30 * 1000,
        clean: true,
        encoding: 'utf8',
        resubscribe: true
    }
};

var conn = {
    client: _mqtt2.default.connect('mqtt://broker.hivemq.com', options.option)
};

exports.default = _extends({}, defaultConfig, config, conn);