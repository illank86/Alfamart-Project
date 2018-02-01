import mysql from 'mysql';
import constants from './constants';

const db = mysql.createPool({
    host: constants.DB_URL,
    user: '...',
    password: constants.DB_PASS,
    database: '...'
})

export default db;
