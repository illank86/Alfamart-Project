'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _storeController = require('./store/store-controller');

var _storeController2 = _interopRequireDefault(_storeController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = new _express.Router();

routes.use('/data', _storeController2.default);

exports.default = routes;