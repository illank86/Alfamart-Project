import express from 'express';

import middleware from './config/middleware';

import constants from './config/constants';
import Routes from './modules/index';

const app = express();

middleware(app);

app.use('/api', Routes);

app.listen(constants.PORT, function(err) {
    if (err) {
        console.log(err);
    } 
    console.log("Server is running at "+ constants.PORT);
});
