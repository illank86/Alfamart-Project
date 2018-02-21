'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _storeModel = require('./store-model');

var _storeModel2 = _interopRequireDefault(_storeModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = new _express.Router();

routes.get('/stores', _storeModel2.default.getAll);
routes.get('/store/:_id', _storeModel2.default.getOne);
routes.post('/add-store', _storeModel2.default.verifyToken, _storeModel2.default.addStore);
routes.delete('/delete-store/:_id/:topic', _storeModel2.default.verifyToken, _storeModel2.default.deleteOne);
routes.post('/add-schedule', _storeModel2.default.verifyToken, _storeModel2.default.addSchedule);
routes.get('/get-schedule/:_id', _storeModel2.default.getOneStore);
routes.put('/update-schedule/:_id', _storeModel2.default.verifyToken, _storeModel2.default.updateSchedule);
routes.get('/get-report/:_id', _storeModel2.default.getOneReport);
routes.post('/register', _storeModel2.default.registerUsers);
routes.post('/login', _storeModel2.default.loginUser);

exports.default = routes;