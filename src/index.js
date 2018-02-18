import express from 'express';

import middleware from './config/middleware';

import constants from './config/constants';
import Routes from './modules/index';
import dbQuery from './modules/store/store-model';


const app = express();
middleware(app);


dbQuery.subscribeOnStart();
app.use('/api', Routes);


app.listen(constants.PORT, function(err) {
    if (err) {
        console.log(err);
    } 
    console.log("Server is running at "+ constants.PORT);
});
