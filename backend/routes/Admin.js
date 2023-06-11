const {Router}= require('express')
const router = Router()
const AdminCtrl= require('../controller/AdminCtrl')
// const Auth = require('../helper/Auth')


router.post('/nuevo', AdminCtrl.crearAdmin)
router.post('/login', AdminCtrl.login)

module.exports= router