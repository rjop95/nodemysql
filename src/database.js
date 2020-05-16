const mysql = require('mysql');
const {promisify} = require('util');

const {database} = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNETION WAS CLOSED');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('DATABASE HAS TO MANY CONNECTIONS');

        }
        if(err.code === 'ECONNREFUSED'){
            Console.error('DATABASE CONNECTION WAS REFUSED');

        }

    }

    if(connection) connection.release();
    console.log('DB is Connected');
    return;

});

//promisify pool querys
pool.query = promisify(pool.query);

module.exports = pool;

