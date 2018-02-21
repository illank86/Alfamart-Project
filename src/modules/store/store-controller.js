import { Router } from 'express';
import bodyParser from 'body-parser';

import dbQuery from './store-model';

const routes = new Router();

routes.get('/stores', dbQuery.getAll);
routes.get('/store/:_id', dbQuery.getOne);
routes.post('/add-store', dbQuery.verifyToken, dbQuery.addStore);
routes.delete('/delete-store/:_id/:topic', dbQuery.verifyToken, dbQuery.deleteOne);
routes.post('/add-schedule', dbQuery.verifyToken, dbQuery.addSchedule);
routes.get('/get-schedule/:_id', dbQuery.getOneStore);
routes.put('/update-schedule/:_id', dbQuery.verifyToken, dbQuery.updateSchedule);
routes.get('/get-report/:_id', dbQuery.getOneReport);
routes.post('/register', dbQuery.registerUsers);
routes.post('/login', dbQuery.loginUser);


export default routes;