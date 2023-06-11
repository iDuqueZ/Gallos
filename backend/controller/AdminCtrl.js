const AdminCtrl = {}
const Admin= require('../models/Admin')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

AdminCtrl.crearAdmin = async(req,res)=>{

    const {user, contrasena} = req.body; 
    
    const NuevoAdmin= new Admin({
        user,
        contrasena
    })

    const userAdmin = await Admin.findOne({user:user})
    if(userAdmin){
        res.json({
            mensaje: 'El usuario ya existe'
        })
    }
    else {
        NuevoAdmin.contrasena = await bcrypt.hash(contrasena,10)
        const token= jwt.sign({_id:NuevoAdmin._id}, "Secreto")
        await NuevoAdmin.save()

        res.json({
            mensaje: 'Bienvenido', 
            id: NuevoAdmin._id,
            user: NuevoAdmin.user,
            token
        })

    }
}


AdminCtrl.login= async(req,res)=>{

    const {user,contrasena} = req.body
    const admin = await Admin.findOne({user:user})
    if(!admin){
        return res.json({
            mensaje: 'Usuario incorrecto'
        })
    }

    const match = await bcrypt.compare(contrasena,admin.contrasena)
    if(match){
        const token = jwt.sign({_id:admin._id}, 'Secreta')
        res.json ({
            mensaje: 'Bienvenido',
            id: admin._id,
            user: admin.user,
            token
        })
    }
    else{
        res.json({
            mensaje: 'Contraseña incorrecta'
        })
    }
}

module.exports= AdminCtrl