'use strict';

var _cluster = require('cluster');

var _cluster2 = _interopRequireDefault(_cluster);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

require('dotenv/config');

var _middleware = require('./config/middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _logger = require('./config/logger');

var _logger2 = _interopRequireDefault(_logger);

var _constants = require('./config/constants');

var _constants2 = _interopRequireDefault(_constants);

var _index = require('./modules/index');

var _index2 = _interopRequireDefault(_index);

var _storeModel = require('./modules/store/store-model');

var _storeModel2 = _interopRequireDefault(_storeModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (_cluster2.default.isMaster) {

    var cpuCount = require('os').cpus().length;

    for (var i = 0; i < cpuCount; i++) {
        var worker = _cluster2.default.fork();
    };

    worker.send({ RunSubs: 'Run Subs' });
    _cluster2.default.on('exit', function (worker) {
        // Replace the dead worker,
        worker;
    });
} else {

    var app = (0, _express2.default)();
    (0, _middleware2.default)(app);
    _logger2.default;
    process.on('message', function (msg) {
        _storeModel2.default.subscribeOnStart();
    });

    app.use('/api', _index2.default);
    app.listen(_constants2.default.PORT, function (err) {
        if (err) {
            _logger2.default.err(err);
        }
        _logger2.default.info('Server Running on PORT ' + _constants2.default.PORT);
    });
}