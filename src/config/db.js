import mysql from 'mysql';
import constants from './constants';

const db = mysql.createPool({
    host: constants.DB_URL,
    user: 'root',
    password: constants.DB_PASS,
    database: 'alfamart'
})

export default db;