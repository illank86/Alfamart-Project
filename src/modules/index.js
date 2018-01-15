import { Router } from 'express';
import routesController from './store/store-controller';


const routes = new Router();

routes.use('/data', routesController);


export default routes;