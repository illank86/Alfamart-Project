'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _middleware = require('./config/middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _constants = require('./config/constants');

var _constants2 = _interopRequireDefault(_constants);

var _index = require('./modules/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

(0, _middleware2.default)(app);

app.use('/api', _index2.default);

app.listen(_constants2.default.PORT, function (err) {
    if (err) {
        console.log(err);
    }
    console.log("Server is running at " + _constants2.default.PORT);
});