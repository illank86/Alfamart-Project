import cluster from 'cluster';
import express from 'express';
import {} from 'dotenv/config';

import middleware from './config/middleware';

import logger from './config/logger';
import constants from './config/constants';
import Routes from './modules/index';
import dbQuery from './modules/store/store-model';

// if(cluster.isMaster) {

//     const cpuCount = require('os').cpus().length;

//     for (let i = 0; i < cpuCount; i++) {
//         var worker = cluster.fork(); 
           
//     };

//     worker.send({RunSubs: 'Run Subs'}); 
//     cluster.on('exit', function (worker) {
//         // Replace the dead worker,
//         worker;        
//     });

// } else {  

    const app = express();
    middleware(app); 
    logger;
    // process.on('message',  function(msg) {
    dbQuery.subscribeOnStart();
    // });

    app.use('/api', Routes);
    app.listen(constants.PORT, function(err) {
        if (err) {
            logger.err(err);
        } 
       logger.info(`Server Running on PORT ${constants.PORT}`)
    });
// }


