//Requerimos las dependencias
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const bodyparser = require('body-parser');
require ('./database')


//Configuración del puerto

app.set('Port',process.env.PORT || 4000);
app.use(morgan('dev'));
app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());
app.use(cors({origen: '*'}));
 
// Declaración del router
app.use('/admin', require('./routes/Admin'))
app.use('/gallo', require('./routes/Gallo'))
app.use('/batalla', require('./routes/Batalla'))


app.listen(app.get('Port'), ()=> {
    console.log('Servidor esta escuchando por el puerto', app.get('Port'))
})
