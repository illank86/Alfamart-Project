'use strict';

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _passportLocal = require('passport-local');

var _passportLocal2 = _interopRequireDefault(_passportLocal);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        _db2.default.query("SELECT * FROM users WHERE id_user = ?", id, function (err, rows) {
            done(err, rows[0]);
        });
    });

    passport.use('local-signup', new _passportLocal2.default({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, username, password, done) {

        _db2.default.query("SELECT * FROM users WHERE username = ?", username, function (err, rows) {
            if (err) {
                return done(err);
            }

            if (rows.length) {
                return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
            } else {

                var saltRounds = 10;
                var newUserMysql = new Object();

                newUserMysql.username = username;
                newUserMysql.password = password;
                newUserMysql.email = req.body.email;
                newUserMysql.name = req.body.name;

                var insertQuery = 'INSERT INTO users ( username, name, email, password ) VALUES (?, ?, ?, ?)';

                _bcrypt2.default.hash(password, saltRounds, function (err, hash) {
                    _db2.default.query('INSERT INTO users ( username, password, email, name ) VALUES (?,?,?,?)', [username, hash, req.body.email, req.body.name], function (err, rows) {
                        if (err) {
                            _logger2.default.error(err);
                            return done(null, false, req.flash('signupMessage', '' + err));
                        } else {
                            newUserMysql.id = rows.insertId;
                            return done(null, newUserMysql);
                        }
                    });
                });
            }
        });
    }));

    passport.use('local-login', new _passportLocal2.default({

        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, username, password, done) {

        _db2.default.query("SELECT * FROM `users` WHERE `username` = ?", username, function (err, rows) {
            if (err) return done(err);
            if (!rows.length) {
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            }

            _bcrypt2.default.compare(password, rows[0].password, function (err, isMatch) {
                if (err) {
                    _logger2.default.error(err);
                }

                if (isMatch) {
                    return done(null, rows[0]);
                } else {
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                }
            });
        });
    }));
};