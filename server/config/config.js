

// process es un objeto global, que esta corriendo a lo largo de toda la aplicacion de node
// tmb ese objeto es actualizado dependiendo del enviroment donde esta corriendo (produccion, desarrollo)
//====================
// PUERTO
//====================
// a continuacion estamos modificando el process enviroment port
process.env.PORT = process.env.PORT || 3000;