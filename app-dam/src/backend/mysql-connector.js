const mysql = require('mysql')

const config =
{
    connectionLimit : 10,
    host: 'mysql-server',
    port : '3306',
    user : 'root',
    password : 'userpass',
    database : 'DAM'
}

/* 
    Se genera un pool de conexiones para que cada vez 
    que un agente tiene que hacer un request toma un recurso,
    como si fuera una IP, y la usa, por ende gracias a esto,
    no hace falta manejar super bien la única conexión.
 */
const pool = mysql.createPool(config);

exports.pool = pool;

pool.getConnection((err,conn) => {
    if(err)
    {
        switch(err.code)
        {
            case 'PROTOCOL_CONNECTION_LOST':
                console.log('La conexión a la BD se cerró');
                break;
            case 'ER_CON_COUNT_ERROR':
                console.log('Número de conexiones superó el máximo')
                break;
            case 'ECONNREFUSED':
                console.log('La conexión fue rechazada')
                break;
            default: 
                console.log('Error desconocido');
                break;
        }

    }else
    {
        if(conn)
        {
            console.log(conn);
            conn.release();
        }
    }
})