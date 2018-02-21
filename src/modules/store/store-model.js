import moment from 'moment';
import bcrypt from 'bcrypt';
import passport from 'passport';
import jwt from 'jsonwebtoken';

import db from '../../config/db';
import constants from '../../config/constants';
import logger from '../../config/logger';
import passportConfig from '../../config/passport';

passportConfig(passport);

const dbQuery = {

    getAll(req, res) {
        db.query('SELECT * FROM store', function(err, result) {            
            if (err) {
                logger.error(`Query getAll has an error: ${err}`);
                res.status(500).send({"error": `${err}`})
            } else {
                res.send(result); 
            }                       
        });
    },

    getOne(req, res) {
        db.query('SELECT * FROM store WHERE id_store = ?', (req.params._id), function(err, result) {            
            if (err) {
                res.status(500).send({"error": `${err}`})
            } else {
                res.send(result);
            }
        });
    },

    addStore(req, res) {
        jwt.verify(req.token, process.env.JWT_SECRET_KEY,   function(err, authData) {
            if(err) {
                res.status(403).send({"error": `${err}`})
            } else {
                let name = req.body.name;
                let address = req.body.address;   
                let topic = req.body.topic;     
                db.query('INSERT INTO store (name, address, topic) VALUES (?, ?, ?)', [name, address, topic], function(err, result) {
                    if (err) { 
                        logger.error(`Query addStore function has an error: ${err}`);               
                        res.status(500).send({ "error": `${err}`});
                    } else {
                        constants.client.subscribe(`alfamart/status/${topic}/info`, { qos: 2 }, function(err, granted) {
                            if(err) {
                                logger.error(`Subsribed at addStore function has an error: ${err}`);
                                res.send({"message": "Store data saved but cannot subscribed"}); 
                            } else {                       
                                res.send({"message": `Store data saved and subscribed to ${granted[0].topic}`});
                            }
                        });                 
                    };
                });
            }
        })       
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
                    logger.error(`Query addSchedule function has an error: ${err}`);
                    res.status(500).send({"error": `${err}`})
                } else {
                    res.json({"message": "Schedule saved successfully"});
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
                logger.error(`Query deleteOne function has an error: ${err}`);
                res.status(500).send({"error": `Unable to delete, ${err}`});
            } else { 
                dbQuery.unsubscribeMqtt(topic, function(msg) {
                    if(msg == 'error') {
                        res.json({"message": "Store deleted but failed to unsubscribe"})
                    } else {
                        res.json({"message": `Deleted and unsubscribed from ${topic} successfully`})
                    }
                });   
            }
        });
    },

    getOneStore(req, res) {
        db.query('SELECT * FROM schedule WHERE id_store = ?', (req.params._id), function(err, result) {            
            if (err) {
                logger.error(`Query getOneStore function has an error: ${err}`);
                res.status(500).send({"error": `Cannot get store data, ${err}`});
            } else {
                res.send(result);
            }
        });
    },

    getOneReport(req, res) {
        db.query('SELECT * FROM report WHERE id_store = ? ORDER BY timestamp DESC LIMIT 1', (req.params._id), function(err, result) {            
            if (err) {
                logger.error(`Query getOneReport function has an error: ${err}`);
                res.status(500).send({"error": `Cannot get report data, ${err}`});
            } else {
                res.json(result);
            }
        });
    },

    selectIdStore(topics, clb) {
        let str = topics;
        let data_topic = str.split('/')[2];  
        db.query('SELECT id_store FROM store WHERE topic = ?', (data_topic), function(err, result) {
            if (err) {
                logger.error(`Query selectIdStore function has an error: ${err}`);
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
    

        if(isNaN(status_3phase) || isNaN(status_1phase) || isNaN(status_auto_manual) || isNaN(current_r) || isNaN(current_s) || isNaN(current_sng )) {
            logger.error('one or more empty (NaN) field are sent by MQTT');
        } else { 
            dbQuery.selectIdStore(topics, function(res) { 
                let stores = res;                          
                let query = `INSERT INTO report (timestamp, status_3phase, status_1phase, status_auto_manual, current_r, current_s, current_t, current_sng, topic, id_store) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

                db.query(query, [timestamps, status_3phase, status_1phase, status_auto_manual, current_r, current_s, current_t, current_sng, topic, stores], function(err, result) {
                    if(err) {
                        logger.error(`Query selectIdStore has an error: ${err}`);
                    }             
                });
            });  
        }
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
                logger.error(`Query queryAllMqtt has an error: ${err}`);
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
            let allMqtt = ['yes@test123'];
            let i;  
            
            dbQuery.mqttOnMessage(); 

            dbQuery.queryAllMqtt(function(data) {
                for(i = 0; i < data.length; i++ ) {
                    allMqtt.push(`alfamart/status/${data[i].topic}/info`);
                }  

                if(allMqtt.length === 0) {
                    return null;
                } else {
                    constants.client.subscribe(allMqtt, { qos: 2 }, function(err, granted) {
                        if(err) {                            
                            logger.error(err)                       
                        } else {     
                            logger.info(`Subscribe to all topics: ${allMqtt}`);                            
                        }
                    });
                }
            });
        });
    },

    unsubscribeMqtt(topic, clb) {
        constants.client.unsubscribe(`alfamart/status/${topic}/info`, function(err, granted) {
            if(err) {
                clb('error');
            } else {
                clb(granted);
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
            res.status(400).json({"error": "One or more field is empty"})
        } else {        
            db.query(update_query, data, function(err, result) {
                if (err) {
                    logger.error(`Query updateSchedule function has an error: ${err}`);
                    res.status(500).send({"error": `Update failed, ${err}`})
                } else {
                    res.json({"message": "Schedules updated successfully"});
                    let i;
                    for(i=0; i < mqtt.length; i++) {
                        dbQuery.sendMqtt(i, mqtt[i][0], mqtt[i][1], topic, komponen)
                    
                    }
                }
            }); 
        }
       
    },

    registerUsers(req, res, next) {       

        req.checkBody('username', 'Username field cannot be empty.').notEmpty();
        req.checkBody('username', 'Username must between 4-15 character long.').len(4, 15);
        req.checkBody('name', 'Do you have a name ?, you should put your name on the name field').notEmpty()
        req.checkBody('email', 'The email you entered is invalid, please try again.').isEmail();
        req.checkBody('password', 'Password must between 4-15 character long.').len(4, 15);
        req.checkBody('passwordMatch', 'Passwords do not match, please try again.').equals(req.body.password);

        const errors = req.validationErrors();        

        if(errors) {
            res.status(500).send({"error": `${errors[0].msg}`});
        } else {
            passport.authenticate('local-signup', function(err, user, info) {
                if (err) return next(err);
                if(user) {
                    res.json({"message": "Register Successfully"})
                } else {     
                    res.status(400).json({"error": `${req.flash(info).signupMessage[0]}`});
                }
            })(req, res, next);            
        }
    },

    loginUser(req, res, next) {
        req.checkBody('username', 'Username field cannot be empty.').notEmpty();
        req.checkBody('password', 'Password field cannot be empty.').notEmpty();

        const errors = req.validationErrors();  
        
        if(errors) {
            res.status(500).send({"error": `${errors[0].msg}`});
        } else {
            passport.authenticate('local-login', function(err, user, info) {
                if (err) return next(err);
                if(user) {
                    console.log(user)
                    jwt.sign({user}, process.env.JWT_SECRET_KEY, function(err, token) {
                        if(err) {
                            res.status(400).json({"error": `${err}`});
                        } else {
                            res.json({"success": true, "message": "Login Success", "token": `${token}`})
                        }
                        
                    });                    
                } else {     
                    res.status(400).json({"success": false, "error": `${req.flash(info).loginMessage[0]}`});
                }
            })(req, res, next);            
        }

    },

    verifyToken(req, res, next) {
        //Get header value
        const secureHeader = req.headers['authorization'];

        if(typeof secureHeader !== 'undefined') {
            //split space
            const security = secureHeader.split(' ');
            const securityToken = security[1];

            req.token = securityToken
            next();
        } else {
            res.status(403).json({"error": "You're unauthorized"});
        }
    }

}

export default dbQuery;