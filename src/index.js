import cluster from 'cluster';
import express from 'express';

import middleware from './config/middleware';

import constants from './config/constants';
import Routes from './modules/index';
import dbQuery from './modules/store/store-model';

if(cluster.isMaster) {

    const cpuCount = require('os').cpus().length;

    for (let i = 0; i < cpuCount; i++) {
        cluster.fork();
    };

    cluster.on('exit', function (worker) {

        // Replace the dead worker,
        console.log('Worker %d died :(', worker.id);
        cluster.fork();
    
    });

} else {  

    const app = express();
    middleware(app);

    constants.client.on('error', function(err) {
        console.log(err)
    })
    dbQuery.subscribeOnStart();
    app.use('/api', Routes);


    app.listen(constants.PORT, function(err) {
        if (err) {
            console.log(err);
        } 
        console.log("Server is running at "+ constants.PORT);
        console.log('Worker %d running!', cluster.worker.id)
    });
}


