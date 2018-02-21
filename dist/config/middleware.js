'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _expressValidator = require('express-validator');

var _expressValidator2 = _interopRequireDefault(_expressValidator);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _connectFlash = require('connect-flash');

var _connectFlash2 = _interopRequireDefault(_connectFlash);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (app) {
    app.use((0, _cors2.default)());
    app.use(_bodyParser2.default.json());
    app.use((0, _expressValidator2.default)());
    app.use(_bodyParser2.default.urlencoded({ extended: true }));
    app.use((0, _expressSession2.default)({
        secret: process.env.COOKIE_SECRET,
        cookie: { maxAge: 60000 },
        resave: true,
        saveUninitialized: true
    }));
    app.use((0, _morgan2.default)('combined'));
    app.use(_passport2.default.initialize());
    app.use(_passport2.default.session());
    app.use((0, _connectFlash2.default)());
};