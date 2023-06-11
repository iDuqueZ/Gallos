const { Router } = require('express');
const router = Router();
const GalloCtrl = require('../controller/GalloCtrl');
const Auth = require('../helper/Auth');
 
router.post('/nuevo', Auth.verificarToken, GalloCtrl.crear);
router.get('/listar', GalloCtrl.listar);
router.get('/listar/:id', GalloCtrl.listarPorId);
router.put('/actualizar/:id', Auth.verificarToken, GalloCtrl.actualizar);
router.delete('/eliminar/:id', Auth.verificarToken, GalloCtrl.eliminar);

module.exports = router;
