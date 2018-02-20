import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';



export default app => { 
    app.use(cors());
    app.use(bodyParser.json()); 
    app.use(bodyParser.urlencoded({ extended: true }));   
    app.use(morgan('combined'));
}

