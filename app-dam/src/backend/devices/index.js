const express = require('express')
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
    pool.query('SELECT * from Dispositivos',function(err,result,fields) 
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
  const sql = 'SELECT * FROM Mediciones ORDER BY fecha DESC';
  pool.query(sql, function (err, rows) {
    if (err) return res.status(400).send(err);
    // devuelve TODAS
    res.status(200).json(rows);
  });
});

/**
 * Get last measurement resource by id
 */
deviceRouter.get(endpoint + "/:id/last-measurement", function(req, res) {
  const id = req.params.id;
  const sql = `
    SELECT *
    FROM Mediciones
    WHERE dispositivoId = ?
    ORDER BY fecha DESC
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
    SELECT m.medicionId, m.fecha, m.valor, LR.apertura
    FROM Mediciones as m
    INNER JOIN Dispositivos as d on d.dispositivoId = m.dispositivoId
    INNER JOIN Electrovalvulas as e on e.electrovalvulaId = d.electrovalvulaId
    INNER JOIN Log_Riegos as LR on (LR.electrovalvulaId = d.electrovalvulaId and LR.fecha = m.fecha)
    WHERE d.dispositivoId = ?
    ORDER BY fecha DESC
  `;
  pool.query(sql, [id], function (err, rows) {
    if (err) return res.status(400).send(err);
    return res.status(200).json(rows);
  });
});

/**
 * Consolidate deviceData after toggle
 */
deviceRouter.post(endpoint + '/:id' + '/toggle', function(req,res,next)
{
    const deviceId = Number(req.params.id)
    if (Number.isNaN(deviceId)) return res.status(400).send({ error: 'id inválido' });

    const humidity = Math.floor(Math.random()*101)

    pool.getConnection((err, conn) => {
         if (err) return res.status(500).send(err);

         conn.beginTransaction(err => {
             if (err) { conn.release(); return res.status(500).send(err); }

                // 1) Buscar electroválvula por dispositivo
                const q1 = `SELECT electrovalvulaId FROM Dispositivos WHERE dispositivoId = ?`;
                conn.query(q1, [deviceId], (err, rows1) => {
                    if (err) return rollback(err);
                    if (!rows1 || rows1.length === 0) return rollback({ error: 'Electroválvula no encontrada' });
                    
                const electrovalvulaId = rows1[0].electrovalvulaId;

                // 2) Obtener la última acción registrada
                const q2 = `
                SELECT apertura
                FROM Log_Riegos
                WHERE electrovalvulaId = ?
                ORDER BY fecha DESC
                LIMIT 1
                `;
                conn.query(q2, [electrovalvulaId], (err, rows2) => {
                    if (err) return rollback(err);
                
                const lastAction = rows2.length ? rows2[0].apertura : 0; // asumimos cerrada
                const newAction = lastAction === 1 ? 0 : 1;

            // 3) Insertar medición
          const q3 = `
            INSERT INTO Mediciones (fecha, valor, dispositivoId)
            VALUES (UTC_TIMESTAMP(), ?, ?)
          `;
          conn.query(q3, [humidity, deviceId], (err) => {
            if (err) return rollback(err);

            // 4) Insertar log de riego
            const q4 = `
              INSERT INTO Log_Riegos (fecha, electrovalvulaId, apertura)
              VALUES (UTC_TIMESTAMP(), ?, ?)
            `;
            conn.query(q4, [electrovalvulaId, newAction], (err) => {
              if (err) return rollback(err);

              // 5) Commit y responder
              conn.commit(err => {
                if (err) return rollback(err);
                conn.release();
                return res.status(200).json({
                  humidity,
                  valveState: newAction === 1 ? 'abierta' : 'cerrada'
                });
              });
            });
          });
        });
      });

      function rollback(e) {
        conn.rollback(() => {
          conn.release();
          res.status(400).json({ error: e?.message || e });
        });
      }
    });
  });
});

/**
 *  Get device resource by id
 */
deviceRouter.get(endpoint + '/:id', function(req, res, next) {
    
    pool.query("SELECT * FROM Dispositivos where dispositivoId = " +req.params.id, function(error,respuesta,campos)
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