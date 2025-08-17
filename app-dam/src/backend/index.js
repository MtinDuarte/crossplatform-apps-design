//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
var cors = require('cors');
var app = express();

/* Instance device router  */
const deviceRouter = require('./devices/index')

/* Configure device router */
app.use(deviceRouter);

//=======[ Main module code ]==================================================

/* CORS handling  */
const corsOptions =
{
    // Cualquier origen es permitido [Sólo desarrollo]
    origin : '*'
}
app.use(cors(corsOptions))



app.get('/', function(req, res, next) {
    res.send({'mensaje': 'Hola DAM'}).status(200);
});

var cb0 = function(req, res, next)
{
    console.log("CB0");
    next();
}
var cb1 = function(req, res, next)
{
    console.log("CB1");
    next();
}
var cb2 = function(req, res, next)
{
    console.log("CB2");
    res.send({'mensaje':'Respuesta OK!'}).status(200);    
    next();
}
//app.get('/',[cb0,cb1,cb2]);

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
