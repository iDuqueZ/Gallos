// Importamos las librerias
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Inicializamos nuestro querido express
const app = express();

// Configuración de las variables de entorno
require('dotenv').config();

mongoose.connect(process.env.MONGO)
    .then(() => console.log("Conectado a la base de datos 👌"))
    .catch(() => console.log("Error conectando con la data 🆘"))

app.use(cors());
app.use(express.json());

// Ruta principal :3
app.get("/",  (req, res)=> {
    return res.json ({mensaje: "todo bien"})
})

app.use("/api/admin",  require('./routes/Admin'));

// Conectamos el puerto 
const port= process.env.PORT;
app.listen (port, () => {
    console.log("server escuchando puerto " +  port)
})
