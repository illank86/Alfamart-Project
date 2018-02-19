import { Router } from 'express';
import bodyParser from 'body-parser';

import dbQuery from './store-model';

const routes = new Router();


routes.get('/stores', dbQuery.getAll);
routes.get('/store/:_id', dbQuery.getOne);
routes.post('/add-store', dbQuery.addStore);
routes.delete('/delete-store/:_id/:topic', dbQuery.deleteOne);
routes.post('/add-schedule', dbQuery.addSchedule);
routes.get('/get-schedule/:_id', dbQuery.getOneStore);
routes.put('/update-schedule/:_id', dbQuery.updateSchedule);
routes.get('/get-report/:_id', dbQuery.getOneReport);

export default routes;