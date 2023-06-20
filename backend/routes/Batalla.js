const { Router } = require('express');
const router = Router();
const BatallaCtrl = require('../controller/BatallaCtrl');

// Ruta para crear una nueva batalla
router.post('/crear/:adminId', BatallaCtrl.crear);

router.post('/crearauto/:adminId', BatallaCtrl.crearAutomatica);

// Ruta para obtener todas las batallas
router.get('/listar/:adminId', BatallaCtrl.listar);

router.get('/listarbatalla/:batallaId', BatallaCtrl.obtenerPorId);

router.delete('/eliminar/:adminId', BatallaCtrl.eliminarTodas);

// Ruta para obtener una batalla por su ID
// router.get('/listar/:id', BatallaCtrl.listarPorId);

// Ruta para actualizar el ganador de una batalla
router.put('/actualizarGanador', BatallaCtrl.actualizarGanador);

// Ruta para actualizar una batalla como empate
router.put('/actualizarEmpate/:batallaId', BatallaCtrl.actualizarEmpate);

// Ruta para eliminar una batalla
// router.delete('/eliminar/:id', BatallaCtrl.eliminar);

module.exports = router;
