import moment from 'moment';
import db from '../../config/db';
import constants from '../../config/constants';

const dbQuery = {

    getAll(req, res) {
        db.query('SELECT * FROM store', function(err, result) {            
            if (err) {
                res.status(500).send({"error": "Internal Server Error"})
            } else {
                res.send(result); 
            }                       
        });
    },

    getOne(req, res) {
        db.query('SELECT * FROM store WHERE id_store = ?', (req.params._id), function(err, result) {            
            if (err) {
                res.status(500).send({"error": "Internal Server Error"})
            } else {
                res.send(result);
            }
        });
    },

    addStore(req, res) {
        let name = req.body.name;
        let address = req.body.address;   
        let topic = req.body.topic;     
        db.query('INSERT INTO store (name, address, topic) VALUES (?, ?, ?)', [name, address, topic], function(err, result) {
            if (err) {                
                res.status(500).send({ "error": "Cannot save data. Internal Server Error"});
            } else {
                dbQuery.subscribeMqtt(topic, function(msg) {
                    if(msg == 'error') {
                        res.send({"message": "store data saved but cannot subscribed"}); 
                    } else { 
                        res.send({"message": "store data saved and subscribed"});
                    }
                });       
            };
        });
    },


    addSchedule(req, res) {
        let senin_on = req.body.senin.time_on;
        let senin_off = req.body.senin.time_off;
        let selasa_on = req.body.selasa.time_on;
        let selasa_off = req.body.selasa.time_off;
        let rabu_on = req.body.rabu.time_on;
        let rabu_off = req.body.rabu.time_off;
        let kamis_on = req.body.kamis.time_on;
        let kamis_off = req.body.kamis.time_off;
        let jumat_on = req.body.jumat.time_on;
        let jumat_off = req.body.jumat.time_off;
        let sabtu_on = req.body.sabtu.time_on;
        let sabtu_off = req.body.sabtu.time_off;
        let minggu_on = req.body.minggu.time_on;
        let minggu_off = req.body.minggu.time_off;
        let minggu = req.body.minggu.day;
        let senin = req.body.senin.day;
        let selasa = req.body.selasa.day;
        let rabu = req.body.rabu.day;
        let kamis = req.body.kamis.day;
        let jumat = req.body.jumat.day;
        let sabtu = req.body.sabtu.day;      
        let id_store = req.body.id_store;
        let topic = req.body.topic;
        let komponen = req.body.komponen;
        let data = [
            [senin_on, senin_off, senin, komponen, id_store],
            [selasa_on, selasa_off, selasa, komponen, id_store],
            [rabu_on, rabu_off, rabu, komponen, id_store],
            [kamis_on, kamis_off, kamis, komponen, id_store],
            [jumat_on, jumat_off, jumat, komponen, id_store],
            [sabtu_on, sabtu_off, sabtu, komponen, id_store],
            [minggu_on, minggu_off, minggu, komponen, id_store]
        ];

        let mqtt = [
            [senin_on, senin_off],
            [selasa_on, selasa_off],
            [rabu_on, rabu_off],
            [kamis_on, kamis_off],
            [jumat_on, jumat_off],
            [sabtu_on, sabtu_off],
            [minggu_on, minggu_off],
       ]

        if(senin_on == '' || senin_off=='' || selasa_on=='' || selasa_off=='' || rabu_on=='' || rabu_off=='' || kamis_on=='' || kamis_off=='' || jumat_on == '' || jumat_off=='' || sabtu_on=='' || sabtu_off =='' || minggu_on=='' || minggu_off=='') {
            res.status(400).json({"error": "one or more field is empty"})
        } else {
            db.query('INSERT INTO schedule (time_on, time_off, day, id_komponen, id_store) VALUES ?', [data] , function(err, result) {
                if (err) {
                    res.status(500).send({"error": "Internal Server Error"})
                } else {
                    res.json({"message": "schedule saved successfully"});
                    let i;
                    for(i=0; i < mqtt.length; i++) {
                        dbQuery.sendMqtt(i, mqtt[i][0], mqtt[i][1], topic, komponen)
                       
                    }
                }
            });
        }  
    },  

    deleteOne(req, res) {
        let id = req.params._id;
        let topic = req.params.topic;
        db.query('DELETE FROM store WHERE id_store = ?', (id), function(err, result) {
            if(err) {
                res.status(500).send({"error": "Cannot delete, Internal Server Error"})
            } else { 
                dbQuery.unsubscribeMqtt(topic, function(msg) {
                    if(msg == 'error') {
                        res.json({"message": "store deleted but cannot unsubscribe"})
                    } else {
                        res.json({"message": "store deleted and unsubscribed successfully"})
                    }
                });   
            }
        });
    },

    getOneStore(req, res) {
        db.query('SELECT * FROM schedule WHERE id_store = ?', (req.params._id), function(err, result) {            
            if (err) {
                res.status(500).send({"error": "Cannot get store data, Internal Server Error"});
            } else {
                res.send(result);
            }
        });
    },

    getOneReport(req, res) {
        db.query('SELECT * FROM report WHERE id_store = ?', (req.params._id), function(err, result) {            
            if (err) {
                res.status(500).send({"error": "Cannot get report data, Internal Server Error"});
            } else {
                res.send(result);
            }
        });
    },

    selectIdStore(topics, clb) {
        let str = topics;
        let data_topic = str.split('/')[2];  
        db.query('SELECT id_store FROM store WHERE topic = ?', (data_topic), function(err, result) {
            if (err) {
                throw err;
            } else {                
                clb(result[0].id_store);
            }
        });
    },

    insertMqttMessage(topics, msg) {
        let str = topics.toString();
        let topic = str.split('/')[2];        
        msg = msg.toString().split(',');         
        let timestamps = moment(new Date()).format("YYYY-MM-DD HH:mm:ss").toString();
        let status_3phase = parseInt(msg[0]);
        let status_1phase = parseInt(msg[1]);
        let status_auto_manual = parseInt(msg[2]);
        let current_r = parseFloat(msg[3]);
        let current_s = parseFloat(msg[4]);
        let current_t = parseFloat(msg[5]); 
        let current_sng = parseFloat(msg[6]);  

        dbQuery.selectIdStore(topics, function(res) { 
            let stores = res;              
            db.query('INSERT INTO report (timestamp, status_3phase, status_1phase, status_auto_manual, current_r, current_s, current_t, current_sng, topic, id_store) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [timestamps, status_3phase, status_1phase, status_auto_manual, current_r, current_s, current_t, current_sng, topic, stores], function(err, result) {
                if(err) {
                    return({"error": err});                    
                } 
            });
        });  
    },

    sendMqtt(i, ton, toff, topic, komp) {        
        let arr_on = ton.split(':');
        let hour_on = parseInt(arr_on[0]);
        let min_on = parseInt(arr_on[1]);
        let arr_off = toff.split(':');
        let hour_off = parseInt(arr_off[0]);
        let min_off = parseInt(arr_off[1]);        
        let day = i+1;       
        constants.client.publish(`alfamart/relay/${topic}/command, 3, ${komp}, ${day}, ${hour_on}, ${min_on}, 00, ${hour_off}, ${min_off}, 00, 1 `)       
    }, 

    queryAllMqtt(clb) {
        db.query('SELECT topic FROM store', function(err, result) {            
            if (err) {
                return({"error": "Internal Server Error"})
            } else {
                clb(result); 
            }                       
        });
    },

    mqttOnMessage() {
        constants.client.on('message', function(topic, message) {        
            dbQuery.insertMqttMessage(topic, message);            
        });
    },

    subscribeOnStart() {
       constants.client.on('connect', function() {
            let allMqtt = [];
            let i;           

            dbQuery.queryAllMqtt(function(data) {
                for(i = 0; i < data.length; i++ ) {
                    allMqtt.push(`alfamart/status/${data[i].topic}/info`);
                }  

                if(allMqtt.length === 0) {
                    return null;
                } else {
                    constants.client.subscribe(allMqtt, function(err, granted) {
                        if(err) {                            
                            constants.client.end();                        
                        } else {     
                            console.log('Connect to MQTT :', allMqtt)                     
                            dbQuery.mqttOnMessage();                       
                        }
                    });
                }
            });
        });
    },

    subscribeMqtt(topic, clb) {       
        constants.client.subscribe(`alfamart/status/${topic}/info`, function(err, granted) {
            if(err) {
                clb('error');
            } else {
                clb(granted);
            }
        });            
    },

    unsubscribeMqtt(topic, clb) {
        constants.client.unsubscribe(`alfamart/status/${topic}/info`, function(err, granted) {
            if(err) {
                clb('error');
            } else {
                clb('granted');
            }
        });
    },

    updateSchedule(req, res) {
        let senin_on = req.body.senin.time_on;
        let senin_off = req.body.senin.time_off;
        let selasa_on = req.body.selasa.time_on;
        let selasa_off = req.body.selasa.time_off;
        let rabu_on = req.body.rabu.time_on;
        let rabu_off = req.body.rabu.time_off;
        let kamis_on = req.body.kamis.time_on;
        let kamis_off = req.body.kamis.time_off;
        let jumat_on = req.body.jumat.time_on;
        let jumat_off = req.body.jumat.time_off;
        let sabtu_on = req.body.sabtu.time_on;
        let sabtu_off = req.body.sabtu.time_off;
        let minggu_on = req.body.minggu.time_on;
        let minggu_off = req.body.minggu.time_off;
        let minggu = req.body.minggu.day;
        let senin = req.body.senin.day;
        let selasa = req.body.selasa.day;
        let rabu = req.body.rabu.day;
        let kamis = req.body.kamis.day;
        let jumat = req.body.jumat.day;
        let sabtu = req.body.sabtu.day;      
        let id_store = req.body.id_store;
        let topic = req.body.topic;
        let komponen = req.body.komponen
        let data = [
            senin, senin_on,
            selasa, selasa_on,
            rabu, rabu_on,
            kamis, kamis_on,
            jumat, jumat_on,
            sabtu, sabtu_on,
            minggu, minggu_on,
            senin, senin_off,
            selasa, selasa_off,
            rabu, rabu_off,
            kamis, kamis_off,
            jumat, jumat_off,
            sabtu, sabtu_off,
            minggu, minggu_off,
            id_store,
            komponen
        ];

       let mqtt = [
            [senin_on, senin_off],
            [selasa_on, selasa_off],
            [rabu_on, rabu_off],
            [kamis_on, kamis_off],
            [jumat_on, jumat_off],
            [sabtu_on, sabtu_off],
            [minggu_on, minggu_off],
       ]
       
        const update_query = `UPDATE schedule
        SET time_on = (CASE
            WHEN day = ? THEN ?
            WHEN day = ? THEN ?
            WHEN day = ? THEN ?
            WHEN day = ? THEN ?
            WHEN day = ? THEN ?
            WHEN day = ? THEN ?
            WHEN day = ? THEN ?
            END),
        time_off = (CASE
            WHEN day = ? THEN ?
            WHEN day = ? THEN ?
            WHEN day = ? THEN ?
            WHEN day = ? THEN ?
            WHEN day = ? THEN ?
            WHEN day = ? THEN ?
            WHEN day = ? THEN ?
            END)
        WHERE id_store = ?
            AND id_komponen = ?`
        
        if(senin_on == '' || senin_off=='' || selasa_on=='' || selasa_off=='' || rabu_on=='' || rabu_off=='' || kamis_on=='' || kamis_off=='' || jumat_on == '' || jumat_off=='' || sabtu_on=='' || sabtu_off =='' || minggu_on=='' || minggu_off=='') {
            res.status(400).json({"error": "one or more field is empty"})
        } else {        
            db.query(update_query, data, function(err, result) {
                if (err) {
                    res.status(500).send({"error": "Update Failed, Internal Server Error"})
                } else {
                    res.json({"message": "schedule updated successfully"});
                    let i;
                    for(i=0; i < mqtt.length; i++) {
                        dbQuery.sendMqtt(i, mqtt[i][0], mqtt[i][1], topic, komponen)
                    
                    }
                }
            }); 
        }
       
    },

}

export default dbQuery;