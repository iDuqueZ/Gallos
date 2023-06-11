const Gallo = require('../models/Gallo');

const GalloCtrl = {};

GalloCtrl.crear = async (req, res) => {
  try {
    const { cuerda, frente, ciudad, color, peso, jaula, marca, tipo, placa, anillo } = req.body;
    
    const nuevoGallo = new Gallo({
      cuerda,
      frente,
      ciudad,
      color,
      peso,
      jaula,
      marca,
      tipo,
      placa,
      anillo
    });
    
    const respuesta = await nuevoGallo.save();

    res.json({
      mensaje: 'Gallo creado',
      respuesta
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el gallo' });
  }
};

GalloCtrl.listar = async (req, res) => {
  try {
    const respuesta = await Gallo.find();

    res.json(respuesta);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la lista de gallos' });
  }
};

GalloCtrl.listarPorId = async (req, res) => {
  try {
    const id = req.params.id;
    const respuesta = await Gallo.findById(id);

    if (!respuesta) {
      return res.status(404).json({ mensaje: 'Gallo no encontrado' });
    }

    res.json(respuesta);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el gallo' });
  }
};

GalloCtrl.actualizar = async (req, res) => {
  try {
    const id = req.params.id;
    const respuesta = await Gallo.findByIdAndUpdate(id, req.body);

    if (!respuesta) {
      return res.status(404).json({ mensaje: 'Gallo no encontrado' });
    }

    res.json({ mensaje: 'Gallo actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el gallo' });
  }
};

GalloCtrl.eliminar = async (req, res) => {
  try {
    const id = req.params.id;
    const respuesta = await Gallo.findByIdAndRemove(id);

    if (!respuesta) {
      return res.status(404).json({ mensaje: 'Gallo no encontrado' });
    }

    res.json({ mensaje: 'Gallo eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el gallo' });
  }
};

module.exports = GalloCtrl;
