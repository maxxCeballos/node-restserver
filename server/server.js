require('./config/config')

const express = require('express')
const mongoose = require('mongoose'); //conexion a la base de datos

const app = express()

// esta es una libreria que se descarga desde npm
// parse application/json
const bodyParser = require('body-parser')

// (*) los app.use son un middleware, funciones que se van a disparar cada vez que se haga una request.

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// para poder rutear las distintas peticiones
app.use( require('./routes/index'))


// 'mongodb://localhost:27017/cafe' fue reemplezado por process.env.URLDB del config.js
mongoose.connect(process.env.URLDB, 
                { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
                (err, res) => {

    if ( err ) throw err;

    console.log('base de datos online')
});
 
 
app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto 3000');
});
