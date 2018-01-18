'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mqtt = require('mqtt');

var _mqtt2 = _interopRequireDefault(_mqtt);

var _db = require('../../config/db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var client = _mqtt2.default.connect('tcp://127.0.0.1');

var dbQuery = {
    getAll: function getAll(req, res) {
        _db2.default.query('SELECT * FROM store', function (err, result) {
            if (err) {
                res.status(500).send({ "error": "Internal Server Error" });
            } else {
                res.send(result);
            }
        });
    },
    getOne: function getOne(req, res) {
        _db2.default.query('Select * FROM store WHERE id_store = ?', req.params._id, function (err, result) {
            if (err) {
                res.status(500).send({ "error": "Internal Server Error" });
            } else {
                res.send(result);
            }
        });
    },
    addStore: function addStore(req, res) {
        var name = req.body.name;
        var address = req.body.address;
        var topic = req.body.topic;
        _db2.default.query('INSERT INTO store (name, address, topic) VALUES (?, ?, ?)', [name, address, topic], function (err, result) {
            if (err) {
                res.status(500).send({ "error": "Cannot save data. Internal Server Error" });
            } else {
                res.send({ "message": "store data saved" });
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
                    res.status(500).send({ "error": "Internal Server Error" });
                } else {
                    res.json({ "message": "schedule saved successfully" });
                    var i = void 0;
                    for (i = 0; i < mqtt.length; i++) {
                        // let ON = S${i}_on;
                        // let OFF = `S${i}_off`;
                        dbQuery.sendMqtt(i, mqtt[i][0], mqtt[i][1], topic, komponen);
                    }
                }
            });
        }
    },
    deleteOne: function deleteOne(req, res) {
        var id = req.params._id;
        _db2.default.query('DELETE FROM store WHERE id_store = ?', id, function (err, result) {
            if (err) {
                res.status(500).send({ "error": "Cannot delete, Internal Server Error" });
            } else {
                res.json({ "message": "store deleted" });
            }
        });
    },
    getOneStore: function getOneStore(req, res) {
        _db2.default.query('Select * FROM schedule WHERE id_store = ?', req.params._id, function (err, result) {
            if (err) {
                res.status(500).send({ "error": "Cannot get store data, Internal Server Error" });
            } else {
                res.send(result);
            }
        });
    },
    sendMqtt: function sendMqtt(i, ton, toff, topic, komp) {
        var arr_on = ton.split(':');
        var hour_on = parseInt(arr_on[0]);
        var min_on = parseInt(arr_on[1]);
        var arr_off = toff.split(':');
        var hour_off = parseInt(arr_off[0]);
        var min_off = parseInt(arr_off[1]);
        var day = i + 1;
        client.publish(topic, '3, ' + komp + ', ' + day + ', ' + hour_on + ', ' + min_on + ', 00, ' + hour_off + ', ' + min_off + ', 00, 1 ');
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
        var data = [senin, senin_on, selasa, selasa_on, rabu, rabu_on, kamis, kamis_on, jumat, jumat_on, sabtu, sabtu_on, minggu, minggu_on, senin, senin_off, selasa, selasa_off, rabu, rabu_off, kamis, kamis_off, jumat, jumat_off, sabtu, sabtu_off, minggu, minggu_off, id_store];

        var mqtt = [[senin_on, senin_off], [selasa_on, selasa_off], [rabu_on, rabu_off], [kamis_on, kamis_off], [jumat_on, jumat_off], [sabtu_on, sabtu_off], [minggu_on, minggu_off]];

        var update_query = 'UPDATE schedule\n        SET time_on = (CASE\n            WHEN day = ? THEN ?\n            WHEN day = ? THEN ?\n            WHEN day = ? THEN ?\n            WHEN day = ? THEN ?\n            WHEN day = ? THEN ?\n            WHEN day = ? THEN ?\n            WHEN day = ? THEN ?\n            END),\n        time_off = (CASE\n            WHEN day = ? THEN ?\n            WHEN day = ? THEN ?\n            WHEN day = ? THEN ?\n            WHEN day = ? THEN ?\n            WHEN day = ? THEN ?\n            WHEN day = ? THEN ?\n            WHEN day = ? THEN ?\n            END)\n        WHERE id_store = ?';

        _db2.default.query(update_query, data, function (err, result) {
            if (err) {
                res.status(500).send({ "error": "Update Failed, Internal Server Error" });
            } else {
                res.json({ "message": "schedule updated successfully" });
                // client.publish(dbQuery.getTopic(id_store), 'test mqtt dari node js 123'); 
                var i = void 0;
                for (i = 0; i < mqtt.length; i++) {
                    // let ON = S${i}_on;
                    // let OFF = `S${i}_off`;
                    dbQuery.sendMqtt(i, mqtt[i][0], mqtt[i][1], topic, komponen);
                }
            }
        });
    }
};

exports.default = dbQuery;