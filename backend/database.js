//Creamos base de datos
const mongoose = require('mongoose')

require('dotenv').config();

URI = (process.env.MONGO);

mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then (bd => console.log('Base de datos conectada', bd.connection.name))
.catch(error => console.log(error))

module.exports= mongoose