const jwt = require('jsonwebtoken')

//====================
// VERIFICAR TOKEN
//====================
let verificaToken = (req, res, next) => {

    // obtenemos los headers de la request
    // lo que va por parametros es el nombre del header que queremos obtener.
    let token = req.get('token')

    jwt.verify( token, process.env.SEED, (err, decoded) => {

        if( err ) {
            // error 401 <=> no autorizado
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            })
        }
        req.usuario = decoded.usuario
    
        next()
    })
}

//====================
// VERIFICAR ADMIN ROL
//====================
let verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario

    if ( usuario.role === 'USER_ROLE' ) {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }

    next()

}


module.exports = {
    verificaToken,
    verificaAdminRole
}