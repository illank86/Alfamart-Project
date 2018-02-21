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

var options = {
    option: {
        port: 1883,
        host: process.env.MQTT_URL,
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
    client: _mqtt2.default.connect(process.env.MQTT_URL, options.option)
};

exports.default = _extends({}, defaultConfig, conn);