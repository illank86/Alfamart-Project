import mysql from 'mysql';
import constants from './constants';

const db = mysql.createPool({
    host: process.env.DB_URL,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database:  process.env.DB_NAME 
})

export default db;
