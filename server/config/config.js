

// process es un objeto global, que esta corriendo a lo largo de toda la aplicacion de node
// tmb ese objeto es actualizado dependiendo del enviroment donde esta corriendo (produccion, desarrollo)
//====================
// PUERTO
//====================
// a continuacion estamos modificando el process enviroment port
process.env.PORT = process.env.PORT || 3000;


//====================
// ENTORNO
//====================
// para saber si estan en desarrollo o en produccion
// si process.NODE_ENV no existe entonces dev, quiere decir que estoy en desarrollo
process.env.NODE_ENV = process.NODE_ENV || 'dev';


//====================
// VENCIMIENTO DE TOKEN
//====================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30

//====================
// SEED DE AUTENTICACION
//====================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'

//====================
// BASE DE DATOS
//====================

let urlDB


// if ( process.env.NODE_ENV === 'dev' ) {
//     urlDB = 'mongodb://localhost:27017/cafe';
// }else {
    // variable de entorno configurada en heroku
    urlDB = process.env.MONGO_URI
//}

// URLDB es un nombre elegido por ustedes, puede ser cualquiera
process.env.URLDB = urlDB;
