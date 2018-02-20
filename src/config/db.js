import mysql from 'mysql';
import constants from './constants';

const db = mysql.createPool({
    host: constants.DB_URL,
    user: process.env.DB_USERNAME || 'root',
    password: constants.DB_PASS,
    database:  process.env.DB_NAME || 'alfamart'
})

export default db;
