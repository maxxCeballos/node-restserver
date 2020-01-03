require('./config/config')

const express = require('express')
const app = express()

// esta es una libreria que se desdecarga desde npm ## INVESTIGAR ##
const bodyParser = require('body-parser')

// (*) los app.use son un middleware, funciones que se van a disparar cada vez que se haga una request.

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 
app.get('/usuario', function (req, res) {
  res.json('Get Usuario')
})

app.post('/usuario', function (req, res) {

    let body = req.body

    if ( body.nombre === undefined ){
        res.status(400).json({
            ok: false,
            msj: 'El nombre es necesario'
        })
    }else{
        res.json({
            persona: body
        })
    }

})

app.put('/usuario/:id', function (req, res) {

    let id = req.params.id

    res.json({
        id
    })
})

app.delete('/usuario', function (req, res) {
    res.json('Delete Usuario')
})
 
 
app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto 3000');
});
