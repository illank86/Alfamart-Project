'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _db = require('../../config/db');

var _db2 = _interopRequireDefault(_db);

var _constants = require('../../config/constants');

var _constants2 = _interopRequireDefault(_constants);

var _logger = require('../../config/logger');

var _logger2 = _interopRequireDefault(_logger);

var _passport3 = require('../../config/passport');

var _passport4 = _interopRequireDefault(_passport3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _passport4.default)(_passport2.default);

var dbQuery = {
    getAll: function getAll(req, res) {
        _db2.default.query('SELECT * FROM store', function (err, result) {
            if (err) {
                _logger2.default.error('Query getAll has an error: ' + err);
                res.status(500).send({ "error": '' + err });
            } else {
                res.send(result);
            }
        });
    },
    getOne: function getOne(req, res) {
        _db2.default.query('SELECT * FROM store WHERE id_store = ?', req.params._id, function (err, result) {
            if (err) {
                res.status(500).send({ "error": '' + err });
            } else {
                res.send(result);
            }
        });
    },
    addStore: function addStore(req, res) {
        _jsonwebtoken2.default.verify(req.token, process.env.JWT_SECRET_KEY, function (err, authData) {
            if (err) {
                res.status(403).send({ "error": '' + err });
            } else {
                var name = req.body.name;
                var address = req.body.address;
                var topic = req.body.topic;
                _db2.default.query('INSERT INTO store (name, address, topic) VALUES (?, ?, ?)', [name, address, topic], function (err, result) {
                    if (err) {
                        _logger2.default.error('Query addStore function has an error: ' + err);
                        res.status(500).send({ "error": '' + err });
                    } else {
                        _constants2.default.client.subscribe('alfamart/status/' + topic + '/info', { qos: 2 }, function (err, granted) {
                            if (err) {
                                _logger2.default.error('Subsribed at addStore function has an error: ' + err);
                                res.send({ "message": "Store data saved but cannot subscribed" });
                            } else {
                                res.send({ "message": 'Store data saved and subscribed to ' + granted[0].topic });
                            }
                        });
                    };
                });
            }
        });
    },
    addSchedule: function addSchedule(req, res) {
        var senin_on = req.body.senin.time_on;
        var senin_off = req.body.senin.time_off;
        var selasa_on = req.body.selasa.time_on;
        var selasa_off = req.body.selasa.time_off;
        var rabu_on = req.body.rabu.time_on;
        var rabu_off = req.body.rabu.time_off;
        var kamis_on = req.body.kamis.time_on;
        var kamis_off = req.body.kamis.time_off;
        var jumat_on = req.body.jumat.time_on;
        var jumat_off = req.body.jumat.time_off;
        var sabtu_on = req.body.sabtu.time_on;
        var sabtu_off = req.body.sabtu.time_off;
        var minggu_on = req.body.minggu.time_on;
        var minggu_off = req.body.minggu.time_off;
        var minggu = req.body.minggu.day;
        var senin = req.body.senin.day;
        var selasa = req.body.selasa.day;
        var rabu = req.body.rabu.day;
        var kamis = req.body.kamis.day;
        var jumat = req.body.jumat.day;
        var sabtu = req.body.sabtu.day;
        var id_store = req.body.id_store;
        var topic = req.body.topic;
        var komponen = req.body.komponen;
        var data = [[senin_on, senin_off, senin, komponen, id_store], [selasa_on, selasa_off, selasa, komponen, id_store], [rabu_on, rabu_off, rabu, komponen, id_store], [kamis_on, kamis_off, kamis, komponen, id_store], [jumat_on, jumat_off, jumat, komponen, id_store], [sabtu_on, sabtu_off, sabtu, komponen, id_store], [minggu_on, minggu_off, minggu, komponen, id_store]];

        var mqtt = [[senin_on, senin_off], [selasa_on, selasa_off], [rabu_on, rabu_off], [kamis_on, kamis_off], [jumat_on, jumat_off], [sabtu_on, sabtu_off], [minggu_on, minggu_off]];

        if (senin_on == '' || senin_off == '' || selasa_on == '' || selasa_off == '' || rabu_on == '' || rabu_off == '' || kamis_on == '' || kamis_off == '' || jumat_on == '' || jumat_off == '' || sabtu_on == '' || sabtu_off == '' || minggu_on == '' || minggu_off == '') {
            res.status(400).json({ "error": "one or more field is empty" });
        } else {
            _db2.default.query('INSERT INTO schedule (time_on, time_off, day, id_komponen, id_store) VALUES ?', [data], function (err, result) {
                if (err) {
                    _logger2.default.error('Query addSchedule function has an error: ' + err);
                    res.status(500).send({ "error": '' + err });
                } else {
                    res.json({ "message": "Schedule saved successfully" });
                    var i = void 0;
                    for (i = 0; i < mqtt.length; i++) {
                        dbQuery.sendMqtt(i, mqtt[i][0], mqtt[i][1], topic, komponen);
                    }
                }
            });
        }
    },
    deleteOne: function deleteOne(req, res) {
        var id = req.params._id;
        var topic = req.params.topic;
        _db2.default.query('DELETE FROM store WHERE id_store = ?', id, function (err, result) {
            if (err) {
                _logger2.default.error('Query deleteOne function has an error: ' + err);
                res.status(500).send({ "error": 'Unable to delete, ' + err });
            } else {
                dbQuery.unsubscribeMqtt(topic, function (msg) {
                    if (msg == 'error') {
                        res.json({ "message": "Store deleted but failed to unsubscribe" });
                    } else {
                        res.json({ "message": 'Deleted and unsubscribed from ' + topic + ' successfully' });
                    }
                });
            }
        });
    },
    getOneStore: function getOneStore(req, res) {
        _db2.default.query('SELECT * FROM schedule WHERE id_store = ?', req.params._id, function (err, result) {
            if (err) {
                _logger2.default.error('Query getOneStore function has an error: ' + err);
                res.status(500).send({ "error": 'Cannot get store data, ' + err });
            } else {
                res.send(result);
            }
        });
    },
    getOneReport: function getOneReport(req, res) {
        _db2.default.query('SELECT * FROM report WHERE id_store = ? ORDER BY timestamp DESC LIMIT 1', req.params._id, function (err, result) {
            if (err) {
                _logger2.default.error('Query getOneReport function has an error: ' + err);
                res.status(500).send({ "error": 'Cannot get report data, ' + err });
            } else {
                res.json(result);
            }
        });
    },
    selectIdStore: function selectIdStore(topics, clb) {
        var str = topics;
        var data_topic = str.split('/')[2];
        _db2.default.query('SELECT id_store FROM store WHERE topic = ?', data_topic, function (err, result) {
            if (err) {
                _logger2.default.error('Query selectIdStore function has an error: ' + err);
            } else {
                clb(result[0].id_store);
            }
        });
    },
    insertMqttMessage: function insertMqttMessage(topics, msg) {
        var str = topics.toString();
        var topic = str.split('/')[2];
        msg = msg.toString().split(',');
        var timestamps = (0, _moment2.default)(new Date()).format("YYYY-MM-DD HH:mm:ss").toString();
        var status_3phase = parseInt(msg[0]);
        var status_1phase = parseInt(msg[1]);
        var status_auto_manual = parseInt(msg[2]);
        var current_r = parseFloat(msg[3]);
        var current_s = parseFloat(msg[4]);
        var current_t = parseFloat(msg[5]);
        var current_sng = parseFloat(msg[6]);

        if (isNaN(status_3phase) || isNaN(status_1phase) || isNaN(status_auto_manual) || isNaN(current_r) || isNaN(current_s) || isNaN(current_sng)) {
            _logger2.default.error('one or more empty (NaN) field are sent by MQTT');
        } else {
            dbQuery.selectIdStore(topics, function (res) {
                var stores = res;
                var query = 'INSERT INTO report (timestamp, status_3phase, status_1phase, status_auto_manual, current_r, current_s, current_t, current_sng, topic, id_store) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

                _db2.default.query(query, [timestamps, status_3phase, status_1phase, status_auto_manual, current_r, current_s, current_t, current_sng, topic, stores], function (err, result) {
                    if (err) {
                        _logger2.default.error('Query selectIdStore has an error: ' + err);
                    }
                });
            });
        }
    },
    sendMqtt: function sendMqtt(i, ton, toff, topic, komp) {
        var arr_on = ton.split(':');
        var hour_on = parseInt(arr_on[0]);
        var min_on = parseInt(arr_on[1]);
        var arr_off = toff.split(':');
        var hour_off = parseInt(arr_off[0]);
        var min_off = parseInt(arr_off[1]);
        var day = i + 1;
        _constants2.default.client.publish('alfamart/relay/' + topic + '/command, 3, ' + komp + ', ' + day + ', ' + hour_on + ', ' + min_on + ', 00, ' + hour_off + ', ' + min_off + ', 00, 1 ');
    },
    queryAllMqtt: function queryAllMqtt(clb) {
        _db2.default.query('SELECT topic FROM store', function (err, result) {
            if (err) {
                _logger2.default.error('Query queryAllMqtt has an error: ' + err);
            } else {
                clb(result);
            }
        });
    },
    mqttOnMessage: function mqttOnMessage() {
        _constants2.default.client.on('message', function (topic, message) {
            dbQuery.insertMqttMessage(topic, message);
        });
    },
    subscribeOnStart: function subscribeOnStart() {
        _constants2.default.client.on('connect', function () {
            var allMqtt = ['yes@test123'];
            var i = void 0;

            dbQuery.mqttOnMessage();

            dbQuery.queryAllMqtt(function (data) {
                for (i = 0; i < data.length; i++) {
                    allMqtt.push('alfamart/status/' + data[i].topic + '/info');
                }

                if (allMqtt.length === 0) {
                    return null;
                } else {
                    _constants2.default.client.subscribe(allMqtt, { qos: 2 }, function (err, granted) {
                        if (err) {
                            _logger2.default.error(err);
                        } else {
                            _logger2.default.info('Subscribe to all topics: ' + allMqtt);
                        }
                    });
                }
            });
        });
    },
    unsubscribeMqtt: function unsubscribeMqtt(topic, clb) {
        _constants2.default.client.unsubscribe('alfamart/status/' + topic + '/info', function (err, granted) {
            if (err) {
                clb('error');
            } else {
                clb(granted);
            }
        });
    },
    updateSchedule: function updateSchedule(req, res) {
        var senin_on = req.body.senin.time_on;
        var senin_off = req.body.senin.time_off;
        var selasa_on = req.body.selasa.time_on;
        var selasa_off = req.body.selasa.time_off;
        var rabu_on = req.body.rabu.time_on;
        var rabu_off = req.body.rabu.time_off;
        var kamis_on = req.body.kamis.time_on;
        var kamis_off = req.body.kamis.time_off;
        var jumat_on = req.body.jumat.time_on;
        var jumat_off = req.body.jumat.time_off;
        var sabtu_on = req.body.sabtu.time_on;
        var sabtu_off = req.body.sabtu.time_off;
        var minggu_on = req.body.minggu.time_on;
        var minggu_off = req.body.minggu.time_off;
        var minggu = req.body.minggu.day;
        var senin = req.body.senin.day;
        var selasa = req.body.selasa.day;
        var rabu = req.body.rabu.day;
        var kamis = req.body.kamis.day;
        var jumat = req.body.jumat.day;
        var sabtu = req.body.sabtu.day;
        var id_store = req.body.id_store;
        var topic = req.body.topic;
        var komponen = req.body.komponen;
        var data = [senin, senin_on, selasa, selasa_on, rabu, rabu_on, kamis, kamis_on, jumat, jumat_on, sabtu, sabtu_on, minggu, minggu_on, senin, senin_off, selasa, selasa_off, rabu, rabu_off, kamis, kamis_off, jumat, jumat_off, sabtu, sabtu_off, minggu, minggu_off, id_store, komponen];

        var mqtt = [[senin_on, senin_off], [selasa_on, selasa_off], [rabu_on, rabu_off], [kamis_on, kamis_off], [jumat_on, jumat_off], [sabtu_on, sabtu_off], [minggu_on, minggu_off]];

        var update_query = 'UPDATE schedule\n        SET time_on = (CASE\n            WHEN day = ? THEN ?\n            WHEN day = ? THEN ?\n            WHEN day = ? THEN ?\n            WHEN day = ? THEN ?\n            WHEN day = ? THEN ?\n            WHEN day = ? THEN ?\n            WHEN day = ? THEN ?\n            END),\n        time_off = (CASE\n            WHEN day = ? THEN ?\n            WHEN day = ? THEN ?\n            WHEN day = ? THEN ?\n            WHEN day = ? THEN ?\n            WHEN day = ? THEN ?\n            WHEN day = ? THEN ?\n            WHEN day = ? THEN ?\n            END)\n        WHERE id_store = ?\n            AND id_komponen = ?';

        if (senin_on == '' || senin_off == '' || selasa_on == '' || selasa_off == '' || rabu_on == '' || rabu_off == '' || kamis_on == '' || kamis_off == '' || jumat_on == '' || jumat_off == '' || sabtu_on == '' || sabtu_off == '' || minggu_on == '' || minggu_off == '') {
            res.status(400).json({ "error": "One or more field is empty" });
        } else {
            _db2.default.query(update_query, data, function (err, result) {
                if (err) {
                    _logger2.default.error('Query updateSchedule function has an error: ' + err);
                    res.status(500).send({ "error": 'Update failed, ' + err });
                } else {
                    res.json({ "message": "Schedules updated successfully" });
                    var i = void 0;
                    for (i = 0; i < mqtt.length; i++) {
                        dbQuery.sendMqtt(i, mqtt[i][0], mqtt[i][1], topic, komponen);
                    }
                }
            });
        }
    },
    registerUsers: function registerUsers(req, res, next) {

        req.checkBody('username', 'Username field cannot be empty.').notEmpty();
        req.checkBody('username', 'Username must between 4-15 character long.').len(4, 15);
        req.checkBody('name', 'Do you have a name ?, you should put your name on the name field').notEmpty();
        req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
        req.checkBody('password', 'Password must between 4-15 character long.').len(4, 15);
        req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);

        var errors = req.validationErrors();

        if (errors) {
            res.status(500).send({ "error": '' + errors[0].msg });
        } else {
            _passport2.default.authenticate('local-signup', function (err, user, info) {
                if (err) return next(err);
                if (user) {
                    res.json({ "message": "Register Successfully" });
                } else {
                    res.status(400).json({ "error": '' + req.flash(info).signupMessage[0] });
                }
            })(req, res, next);
        }
    },
    loginUser: function loginUser(req, res, next) {
        req.checkBody('username', 'Username field cannot be empty.').notEmpty();
        req.checkBody('password', 'Password field cannot be empty.').notEmpty();

        var errors = req.validationErrors();

        if (errors) {
            res.status(500).send({ "error": '' + errors[0].msg });
        } else {
            _passport2.default.authenticate('local-login', function (err, user, info) {
                if (err) return next(err);
                if (user) {
                    console.log(user);
                    _jsonwebtoken2.default.sign({ user: user }, process.env.JWT_SECRET_KEY, function (err, token) {
                        if (err) {
                            res.status(400).json({ "error": '' + err });
                        } else {
                            res.json({ "success": true, "message": "Login Success", "token": '' + token });
                        }
                    });
                } else {
                    res.status(400).json({ "success": false, "error": '' + req.flash(info).loginMessage[0] });
                }
            })(req, res, next);
        }
    },
    verifyToken: function verifyToken(req, res, next) {
        //Get header value
        var secureHeader = req.headers['authorization'];

        if (typeof secureHeader !== 'undefined') {
            //split space
            var security = secureHeader.split(' ');
            var securityToken = security[1];

            req.token = securityToken;
            next();
        } else {
            res.status(403).json({ "error": "You're unauthorized" });
        }
    }
};

exports.default = dbQuery;