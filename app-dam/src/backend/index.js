//=======[ Settings, Imports & Data ]==========================================

var PORT    = 3000;

var express = require('express');
var cors = require('cors');
var app = express();

/* Instance device router  */
const deviceRouter = require('./devices/index')

/* Configure device router */
app.use(deviceRouter);

const mqtt = require('./mqtt/index');
mqtt.connectToBroker();

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

app.listen(PORT, function(req, res) {
    console.log("NodeJS API running correctly");
});

//=======[ End of file ]=======================================================
