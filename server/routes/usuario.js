const express = require('express')
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt')
const _ = require('underscore') // el _ es un estandar que propone underscore para su uso
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion')

const app = express()

app.get('/usuario', verificaToken, (req, res) =>  {

    let desde = req.query.desde || 0
    desde = Number(desde)

    let limite = req.query.limite || 5
    limite = Number(limite)

    // find y exec son funciones de mongoose.
    // exec es para ejecutar el find
    // 'nombre email' especifica que en la respuesta de la query solo queremos recibir esos parametros del usuario
    // estado true o false refleja si el usuario fue eliminado o no. false = eliminado
    // estado : true es una condicion que ponemos en nuestra consulta para que solo nos traiga los usuarios no eliminados
    Usuario.find({ estado: true }, 'nombre email')
        .skip(desde) // esto saltea los primeros 'desde' usuarios
        .limit(limite) //recupera a lo sumo 'limite' usuarios. Esto es por si tenemos 1000 y no queremos traerlos todos.
        .exec( ( err, usuarios ) => {

            if ( err ){
                return res.status(400).json({
                    ok: false,
                    err
                })
            }else{
                // count cuenta la cantidad de registros que va a devolver la query
                // con la condicion estado: true decimos que solo cuento los usuarios no eliminados
                Usuario.count({ estado: true }, (err, conteo) => {

                    res.json({
                        ok: true,
                        usuarios,
                        cuantos: conteo
                    })

                })

                
            }

        })

})
  
app.post('/usuario', [verificaToken, verificaAdminRole], function (req, res) {

    let body = req.body

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        // bcrypt es una paquete disponible en npm para encriptar datos
        // ejecuta de forma sincrona, con un hash de 10 vueltas
        password: bcrypt.hashSync( body.password, 10), 
        role: body.role
    })

    // save es una palabra reservada de mongoose
    // guarda el usuario en la base de datos
    usuario.save( (err, usuarioDB) => {

    if ( err ){
        return res.status(400).json({
            ok: false,
            err
        })
    }else{
        // usuarioDB.password = null para que no retorne la contrasenia, por cuestiones de seguridad.

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    }
    })    

})
  
app.put('/usuario/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id
    
    // esto se reemplaza por la linea de abajo
    //let body = req.body
    // en el arreglo se pasan todos los atributos que vamos a permitir que se actualicen a traves de la request
    // esto es para evitar que no se actualicen datos que son no mutables, por ejemplo si fue creado a traves de google o no.
    let body = _.pick( req.body, ['nombre', 'email', 'img', 'role', 'estado'])

    // findByIdAndUpdate es una funcion de mongoose, tiene varias de este estilo
    // la opcion new (de mongoose), es para que retorne en la respuesta el objeto ya actualizado y no el anterior.
    // la opcion runValidators (de mongoose), es para que no podamos ingresar valores que en el post no estan permitidos.
    // si no colocamos runValidators se pueden actualizar datos que en el post no permitimos, es una especie de bug de mongoose.
    Usuario.findByIdAndUpdate( id, body, {new: true, runValidators: true } ,(err, usuarioDB) => {

        if ( err ){
            return res.status(400).json({
                ok: false,
                err
            })
        }else{
            res.json({
                ok: true,
                usuario: usuarioDB
            })
        }

    })

    
})
  
app.delete('/usuario/:id', [verificaToken, verificaAdminRole], function (req, res) {

    let id = req.params.id
    let body = _.pick( {estado: false}, ['estado'])

    Usuario.findByIdAndUpdate(id, body, {new: true } , (err, usuarioEliminado) => {

        if ( err ){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        
        if( !usuarioEliminado ){

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
            
        }

        res.json({
            ok: true,
            usuario: usuarioEliminado
        })

    })

})

// exportamos la instancia de app para poderla usar en server.js
module.exports = app;