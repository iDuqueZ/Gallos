const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const Admin = require('../models/Admin');

router.post("/crear", async (res, req) =>{
    const {username} = req.body;
    const testuser = await Admin.findOne({username})

    if(!testuser){
        return res.status(500).json({mensage: 'Usuario invalido'})
    }

    const admin = new Admin(req.body)
    try {
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        Admin.password = bcrypt.hashSync(req.body.password, salt)

        Admin.save();
        return res.status(201).json({mensage: 'Administrador creado con éxito 🟢'})
    } catch (error) {
        return res.status(500).json({mensage: 'Error creando Administrador 🟥'})
    }
})

module.exports = router;
