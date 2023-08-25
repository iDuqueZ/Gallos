const Gallo = require('../models/Gallo');
const Admin = require('../models/Admin')
const Batalla = require('../models/Batalla');

const GalloCtrl = {};

GalloCtrl.crear = async (req, res) => {
    try {
        const { cuerda, frente, ciudad, color, peso, jaula, marca, tipo, placa, anillo, adminId } = req.body;

        // Verificar si ya existe un gallo con la misma cuerda, frente o anillo

        const galloExistente2 = await Gallo.findOne({ anillo });
        if (galloExistente2) {
            return res.status(400).json({ mensaje: 'Ya existe un gallo con ese anillo' });
        }

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
            anillo,
            adminId
        });

        const respuesta = await nuevoGallo.save();

        // Asociar el nuevo gallo al admin correspondiente
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ mensaje: 'Admin no encontrado' });
        }
        admin.gallos.push(nuevoGallo._id);
        await admin.save();

        res.json({
            mensaje: 'Gallo creado',
            respuesta
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el gallo', descrip: error });
    }
};



GalloCtrl.listar = async (req, res) => {
    try {
      const adminId = req.params.adminId;
      const admin = await Admin.findById(adminId);
      if (!admin) {
        return res.status(404).json({ mensaje: 'Admin no encontrado' });
      }
  
      const gallos = await Gallo.find({ adminId: adminId});
      res.json(gallos);
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
        
        // Verificar si el gallo está en alguna batalla
        const galloEnBatalla = await Batalla.findOne({
            $or: [{ peleadorAzul: id }, { peleadorRojo: id }],
        });

        if (galloEnBatalla) {
            return res.status(400).json({ mensaje: 'No se puede eliminar el gallo porque está en una batalla' });
        }

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
