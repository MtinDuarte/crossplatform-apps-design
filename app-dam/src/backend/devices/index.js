const express = require('express');
const { toggleMQTTChannel } = require('../mqtt/index');
var cors = require('cors');
const deviceRouter = express.Router();

/* CORS handling  */
const corsOptions =
{
    // Cualquier origen es permitido [Sólo desarrollo]
    origin : '*'
}
deviceRouter.use(cors(corsOptions))

let endpoint = '/devices';

var pool = require('../mysql-connector').pool

/**
 *  Get all devices
 */
deviceRouter.get(endpoint , function(req,res)
{
    console.log("Backend: Query done from devices.");

    pool.query('SELECT * from Devices',function(err,result,fields) 
    {
        if(err)
        {
            res.send(err).status(400);
            return;
        }
        res.send(result).status(200);
    })  
})

/**
 * Get all measurements
 */
deviceRouter.get(endpoint + '/measurements', function (req, res) {
  const sql = 'SELECT * FROM Measurements ORDER BY TimestampUTC DESC';
  pool.query(sql, function (err, rows) {
    if (err) return res.status(400).send(err);
    // devuelve TODAS
    res.status(200).json(rows);
  });
});

/**
 * Get last measurement resource by id
 */
deviceRouter.get(endpoint + "/:DeviceID/last-measurement", function(req, res) {
  
  const id = req.params.DeviceID;
  
  const sql = `
    SELECT *
    FROM Measurements
    WHERE DeviceID = ?
    ORDER BY TimestampUTC DESC
    LIMIT 1
  `;
  pool.query(sql, [id], function(err, result) {
    if (err) return res.status(400).send(err);
    res.status(200).json(result[0] ?? null);
  });
});

/**
 * Get measurements BY device id
 */
deviceRouter.get(endpoint + '/:id/measurements', function (req, res) {
  const id = req.params.id;
  const sql = `
    SELECT *
    FROM Measurements as m
    INNER JOIN Devices as d on d.DeviceID = m.DeviceID
    ORDER BY TimestampUTC DESC
  `;
  pool.query(sql, [id], function (err, rows) {
    if (err) return res.status(400).send(err);
    return res.status(200).json(rows);
  });
});

// Asegúrate de que el método sea .post() y que capture el parámetro ':id'
deviceRouter.post(endpoint + '/:DeviceID' + '/enable-mqtt' + '/:enable', function(req, res) {
    // 1. Capturar el ID del dispositivo desde la URL
   const DeviceID = req.params.DeviceID;

    // 2. Capturar el valor booleano 'enable' desde el cuerpo JSON
    // Se recomienda usar una desestructuración o acceso seguro.
   let enableState = req.params.enable; 

   console.log("Device ID " + DeviceID + " enableState: " + enableState);
    
    toggleMQTTChannel(DeviceID, enableState, (err) => {
        if (err) {
            console.error('Error al publicar el comando MQTT:', err);
            // Devolver un estado 500 (Error Interno del Servidor) con el valor false
            return res.status(500).send(false); 
        }
         // Devolver el valor true si el publish fue exitoso (estado 200 OK)
         res.status(200).send(true); 
     });
});

/**
 *  Get device resource by id
 */
deviceRouter.get(endpoint + '/:id', function(req, res, next) {
    
    pool.query("SELECT * FROM Devices where ID = " +req.params.id, function(error,respuesta,campos)
    {
        if(error==null){
            console.log(respuesta);
            res.status(200).send(respuesta);    
        }else{
            console.log(error);
            res.status(409).send({error:"Falló la consulta"});
        }
    })
});

module.exports = deviceRouter;