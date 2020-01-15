const express = require('express')

let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion')

let app = express()

let Categoria = require('../models/categoria')

// Muestra todas las categorias
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        // ordena la respuesta por atributo descripcion segun orden alfabetico
        .sort('descripcion')
        // populate va a revisar que ObjectId existe en la categoria que estoy solicitando
        // el primer parametro es el atributo que quiero recibir como objeto entero
        // el segundo parametro son los atributos que quiero obtener del objeto entero
        // en caso de querer hacer populate de otro atributo => .populate('otro-objeto','atributo-deseado')
        .populate('usuario', 'nombre email')
        .exec((err, categoriasDB) => {

        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriasDB
        })
    })

})


// Muestra una categoria por ID
app.get('/categoria/:id', (req, res) => {

    Categoria.findOne({ _id : req.params.id }, (err, unaCategoria) => {
        
        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if ( !unaCategoria ) {
            return res.status(400).json({
                ok: false,
                message: 'No existe una categoria con ese id'
            })
        }

        res.json({
            ok: true,
            unaCategoria
        })


    })

})


// Crea una nueva categoria
app.post('/categoria', verificaToken, (req, res) => {
    //Regresa la nueva categoria

    let unaCategoria = new Categoria({
        descripcion: req.body.descripcion,
        usuario: req.body.usuario
    })

    unaCategoria.save( (err, categoriaSave) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if ( !categoriaSave ) {
            return res.status(400).json({
                ok: false,
                message: 'mensaje de !categoriaSave'
            })
        }

        res.json({
            ok: true,
            categoria: categoriaSave
        })

    })

})

// Actualiza una categoria
app.put('/categoria/:id', verificaToken,(req, res) => {

    Categoria.findByIdAndUpdate( req.params.id , {
        descripcion: req.body.descripcion,
        usuario: req.body.usuario
        }, {new: true, runValidators: true }, (err, categoriaUpdate) => {

            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if ( !categoriaUpdate ) {
                return res.status(400).json({
                    ok: false,
                    err,
                    message: 'No existe una categoria con ese id'
                })
            }

            res.json({
                ok: true,
                categoria: categoriaUpdate
            })
        })

})

// Elimina una categoria
app.delete('/categoria/:id', [verificaToken, verificaAdminRole] ,(req, res) => {
    // solo un administrador puede borrar una categoria
    Categoria.findByIdAndDelete( req.params.id, (err, categoriaDelete) => {

        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if ( !categoriaDelete ) {
            return res.status(400).json({
                ok: false,
                err,
                message: 'No existe una categoria con ese id'
            })
        }

        res.json({
            ok: true,
            message: 'Categoria Eliminada'
        })
    })
})



module.exports = app