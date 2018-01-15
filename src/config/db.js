import mysql from 'mysql';
import constants from './constants';

const db = mysql.createPool({
    host: constants.DB_URL,
    user: 'b076b71a586ce1',
    password: constants.DB_PASS,
    database: 'heroku_4b747e7cb16ae71'
})

export default db;