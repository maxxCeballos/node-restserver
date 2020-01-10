const  mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


let Schema = mongoose.Schema

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let usuarioSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'el nombre es necesario']
    },
    email: {
        type: String,
        required: [true, 'el correo es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'la contrasenia es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type : String,
        enum: rolesValidos, //enum quiere decir que el rol tiene que existir dentro de esta enumeracion
        default: 'USER_ROLE'
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})

// esta funcion es para retirar el password de la respuesta de una request de creacion por ejemplo
// esto es por cuestiones de seguridad.
usuarioSchema.methods.toJSON = function(){

    let user = this
    let userObject = user.toObject()
    delete userObject.password

    return userObject
}

//path hace referencia al atributo unique
// en este caso el msj diria email debe ser unico ya que es el unico atributo unique de nuestro modelo
usuarioSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser unico'})

module.exports = mongoose.model( 'Usuario', usuarioSchema )