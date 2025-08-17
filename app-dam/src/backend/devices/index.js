const express = require('express')
const deviceRouter = express.Router();

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