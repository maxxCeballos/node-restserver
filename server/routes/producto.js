const express = require('express')
const { verificaToken } = require('../middlewares/autenticacion')

let app = express()

let Producto = require('../models/producto')


app.get('/producto', verificaToken, (req, res) => {
    
    let desde = req.query.desde || 0
    desde = Number(desde)
    let limite = req.query.limite || 5
    limite = Number(limite)

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productsDB) => {
             
            if( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos: productsDB
            })
        })
})
    

app.get('/producto/:id', verificaToken, (req, res) => {

    Producto.findById(req.params.id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec( (err, productDB) => {
            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if ( !productDB ) {
                return res.status(400).json({
                    ok: false,
                    message: 'No existe producto con ese id'
                })
            }

            res.status(200).json({
                ok: true,
                producto: productDB
            })

    })
})

// ====================
// BUSCAR PRODUCTO CON EXPRESION REGULAR
// ====================
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    // si en el find lo utilizamos asi, tendria que ser sintacticamente igual al nombre de la BD
    let termino = req.params.termino

    // expresion regular
    // i especifica insensible a las mayusculas y minusculas
    let regex = new RegExp(termino, 'i')

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec( (err, productosDB) => {

            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }


            res.status(200).json({
                ok: true,
                productos: productosDB
            })

        })
})


app.post('/producto', verificaToken, (req, res) => {

    let unProducto = new Producto({
        nombre: req.body.nombre,
        precioUni: req.body.precioUni,
        descripcion: req.body.descripcion,
        disponible: req.body.disponible,
        categoria: req.body.categoria,
        usuario: req.body.usuario
    })

    unProducto.save((err, productSaved) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        res.status(201).json({
            ok: true,
            producto: productSaved
        })
    })
})

app.put('/producto/:id', verificaToken, (req, res) => {

    let body = req.body;

    Producto.findById(req.params.id, (err, productDB) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if ( !productDB ) {
            return res.status(400).json({
                ok: false,
                message: 'No existe producto con ese id'
            })
        }

        // otra forma de actualizar un objeto
        productDB.nombre = body.nombre
        productDB.precioUni = body.precioUni
        productDB.categoria = body.categoria
        productDB.disponible = body.disponible
        productDB.descripcion = body.descripcion

        productDB.save( (err, productSaved) => {
            if( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.status(200).json({
                ok: true,
                producto: productSaved
            })

        })
        
    })
})

app.delete('/producto/:id', verificaToken, (req, res) => {

    Producto.findByIdAndUpdate( req.params.id, { disponible : false }, (err, producDeleted) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if ( !producDeleted ) {
            return res.status(400).json({
                ok: false,
                message: 'No existe producto con ese id'
            })
        }

        res.status(200).json({
            ok: true,
            producto: producDeleted
        })
    })
})

module.exports = app