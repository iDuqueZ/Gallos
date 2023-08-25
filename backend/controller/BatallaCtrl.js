const Batalla = require('../models/Batalla');
const Gallo = require('../models/Gallo');
const Admin = require('../models/Admin')

const BatallaCtrl = {};

BatallaCtrl.eliminarTodas = async (req, res) => {

  try {
    // Eliminar las batallas del administrador
    const adminId = req.params.adminId;
    await Batalla.deleteMany({ adminId: adminId });

    res.json({
      mensaje: 'Batallas eliminadas correctamente',
    });

  } catch (error) {
    res.status(500).json({ error: 'Error eliminando batallas' });
  }
}

BatallaCtrl.crearAutomatica = async (req, res) => {
  const { adminId } = req.params;
  const { margenPeso } = req.body;

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ mensaje: 'Admin no encontrado' });
    }

    // Obtener todos los gallos registrados
    const gallos = await Gallo.find({ adminId: adminId });
    console.log(gallos.length)

    // Obtener los gallos disponibles que no participan en ninguna batalla
    const gallosDisponibles = await obtenerGallosDisponibles(gallos, adminId);

    // Obtener las batallas existentes
    const batallasExistentes = await Batalla.find({ adminId: adminId });

    // Crear las batallas automáticamente con gallos de pesos similares
    const batallasCreadas = await crearBatallasSimilares(gallosDisponibles, margenPeso, batallasExistentes, adminId);

    res.json({
      mensaje: 'Batallas creadas automáticamente',
      batallasSimilares: batallasCreadas,
    });

  } catch (error) {
    res.status(500).json({ error: 'Error al crear las batallas automáticamente' });
  }
};

const obtenerGallosDisponibles = async (gallos, adminId) => {
  const gallosDisponibles = [];

  try {
    for (const gallo of gallos) {
      const estaEnBatalla = await Batalla.findOne({
        $or: [
          { peleadorAzul: gallo._id },
          { peleadorRojo: gallo._id }
        ],
        adminId: adminId
      });
  
      if (!estaEnBatalla) {
        console.log(gallo);
        gallosDisponibles.push(gallo);
      }
    }
  
    return gallosDisponibles;
  } catch (error) {
   console.log(error) 
  }
  
};



const crearBatallasSimilares = async (gallos, margenPeso, batallasExistentes, adminId) => {
  const batallasCreadas = [];
  const gallosParticipantes = new Set();

  for (let i = 0; i < gallos.length - 1; i++) {
    const galloAzul = gallos[i];

    if (!gallosParticipantes.has(galloAzul._id)) {
      for (let j = i + 1; j < gallos.length; j++) {
        const galloRojo = gallos[j];

        if (
          !gallosParticipantes.has(galloRojo._id) &&
          Math.abs(galloAzul.peso - galloRojo.peso) <= margenPeso &&
          galloAzul.cuerda !== galloRojo.cuerda &&
          !tieneBatalla(galloAzul._id, galloRojo._id, batallasExistentes)
        ) {
          const nuevaBatalla = new Batalla({
            peleadorAzul: galloAzul._id,
            peleadorRojo: galloRojo._id,
            ganador: null,
            adminId: adminId,
          });

          const batallaGuardada = await nuevaBatalla.save();
          batallasCreadas.push(batallaGuardada);

          gallosParticipantes.add(galloAzul._id);
          gallosParticipantes.add(galloRojo._id);
          break; // Salir del bucle interno una vez que se ha encontrado un gallo rojo adecuado
        }
      }
    }
  }

  return batallasCreadas;
};

const tieneBatalla = (galloId1, galloId2, batallas) => {
  return batallas.some(batalla => 
    (batalla.peleadorAzul.toString() === galloId1 && batalla.peleadorRojo.toString() === galloId2) ||
    (batalla.peleadorAzul.toString() === galloId2 && batalla.peleadorRojo.toString() === galloId1)
  );
};





BatallaCtrl.crear = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ mensaje: 'Admin no encontrado' });
    }

    const { cuerdaAzul, frenteAzul, anilloAzul, cuerdaRojo, anilloRojo, frenteRojo } = req.body;

    // Verificar si los gallos existen
    const peleadorAzul = await Gallo.findOne({ cuerda: cuerdaAzul, frente: frenteAzul, anillo: anilloAzul, adminId: adminId });
    const peleadorRojo = await Gallo.findOne({ cuerda: cuerdaRojo, frente: frenteRojo, anillo: anilloRojo, adminId: adminId });

    if (!peleadorAzul || !peleadorRojo) {
      return res.status(404).json({ mensaje: 'No se encontraron los gallos' });
    }

    // Verificar si los gallos ya se encuentran en una batalla
    const gallosEnBatalla = await Batalla.find({
      $or: [
        { peleadorAzul: peleadorAzul._id },
        { peleadorRojo: peleadorRojo._id }
      ],
      ganador: null // Solo se consideran las batallas sin ganador
    });

    if (gallosEnBatalla.length > 0) {
      return res.status(400).json({ mensaje: 'Los gallos ya se encuentran en una batalla' });
    }

    // Crear la batalla
    const nuevaBatalla = new Batalla({
      peleadorAzul: peleadorAzul._id,
      peleadorRojo: peleadorRojo._id,
      adminId: adminId,
      ganador: null // Por defecto, no hay ganador al crear la batalla
    });

    const respuesta = await nuevaBatalla.save();

    res.json({
      mensaje: 'Batalla creada',
      respuesta
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la batalla' });
  }
};



BatallaCtrl.listar = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    const batallas = await Batalla.find({ adminId: adminId });

    res.json(batallas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la lista de batallas' });
  }
};

BatallaCtrl.obtenerPorId = async (req, res) => {
  try {
    const batallaId = req.params.batallaId;
    const batalla = await Batalla.findById(batallaId);

    if (!batalla) {
      return res.status(404).json({ error: 'Batalla no encontrada' });
    }

    res.json(batalla);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la batalla' });
  }
};


BatallaCtrl.actualizarGanador = async (req, res) => {
  try {
    const { batallaId, ganadorId, tiempo } = req.body;

    // Verificar si la batalla existe
    const batalla = await Batalla.findById(batallaId);

    if (!batalla) {
      return res.status(404).json({ mensaje: 'Batalla no encontrada' });
    }

    // Verificar si el ganador es uno de los gallos de la batalla
    const peleadorAzulId = batalla.peleadorAzul.toString();
    const peleadorRojoId = batalla.peleadorRojo.toString();

    if (ganadorId !== peleadorAzulId && ganadorId !== peleadorRojoId) {
      return res.status(400).json({ mensaje: 'El ganador no es uno de los gallos de la batalla' });
    }

    const perdedorId = ganadorId === peleadorAzulId ? peleadorRojoId : peleadorAzulId;

    // Si ya hay un ganador en la batalla, restar un punto a sus ganadas
    if (batalla.ganador) {
      await Gallo.findByIdAndUpdate(batalla.ganador, { $inc: { ganadas: -1 } });
    }

    // Actualizar el ganador de la batalla
    batalla.ganador = ganadorId;

    // Incrementar el campo "ganadas" del gallo ganador
    await Gallo.findByIdAndUpdate(ganadorId, { $inc: { ganadas: 1 }, $push: { tiempo } });

    // Incrementar el campo "perdidas" del gallo perdedor
    await Gallo.findByIdAndUpdate(perdedorId, { $inc: { perdidas: 1 } });

    const respuesta = await batalla.save();

    res.json({
      mensaje: 'Ganador de la batalla actualizado',
      respuesta
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el ganador de la batalla' });
  }
};


BatallaCtrl.actualizarEmpate = async (req, res) => {
  try {
    const batallaId = req.params.batallaId;

    // Verificar si la batalla existe
    const batalla = await Batalla.findById(batallaId);

    if (!batalla) {
      return res.status(404).json({ mensaje: 'Batalla no encontrada' });
    }

    // Si ya hay un ganador en la batalla, restar un punto a sus ganadas
    if (batalla.ganador) {
      await Gallo.findByIdAndUpdate(batalla.ganador, { $inc: { ganadas: -1 } });
    }

    // Actualizar el ganador de la batalla como empate (null en ambos peleadores)
    batalla.ganador = null;

    // Incrementar el campo "tablas" en ambos gallos
    await Gallo.updateMany(
      { _id: { $in: [batalla.peleadorAzul, batalla.peleadorRojo] } },
      { $inc: { tablas: 1 } }
    );

    const respuesta = await batalla.save();

    res.json({
      mensaje: 'Batalla actualizada como empate',
      respuesta
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la batalla como empate' });
  }
};

module.exports = BatallaCtrl;
