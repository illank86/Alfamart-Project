import { Router } from 'express';
import bodyParser from 'body-parser';

import dbQuery from './store-model';

const routes = new Router();

routes.get('/stores', dbQuery.getAll);
routes.get('/store/:_id', dbQuery.getOne);
routes.post('/add-store', dbQuery.addStore);
routes.delete('/delete-store/:_id', dbQuery.deleteOne);
routes.post('/add-schedule', dbQuery.addSchedule);
routes.get('/get-schedule/:_id', dbQuery.getOneStore);
routes.put('/update-schedule/:_id', dbQuery.updateSchedule);

export default routes;