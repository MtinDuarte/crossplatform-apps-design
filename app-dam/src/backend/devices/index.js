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

module.exports = deviceRouter;