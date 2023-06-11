const Batalla = require('../models/Batalla');
const Gallo = require('../models/Gallo');

const BatallaCtrl = {};

BatallaCtrl.crearAutomatica = async (req, res) => {
    try {
        // Obtener todos los gallos registrados
        const gallos = await Gallo.find();

        // Filtrar los gallos con peso similar
        const margenPeso = req.body.margenPeso; // Margen de peso permitido para considerarlos similares
        const gallosSimilares = [];

        for (let i = 0; i < gallos.length; i++) {
            const galloActual = gallos[i];

            for (let j = i + 1; j < gallos.length; j++) {
                const galloComparado = gallos[j];

                if (Math.abs(galloActual.peso - galloComparado.peso) <= margenPeso) {
                    gallosSimilares.push({ azul: galloActual, rojo: galloComparado });
                }
            }
        }

        // Crear las batallas automáticamente
        const batallasCreadas = [];

        for (const { azul, rojo } of gallosSimilares) {
            const nuevaBatalla = new Batalla({
                peleadorAzul: azul._id,
                peleadorRojo: rojo._id,
                ganador: null // Por defecto, no hay ganador al crear la batalla
            });

            const respuesta = await nuevaBatalla.save();
            batallasCreadas.push(respuesta);
        }

        res.json({
            mensaje: 'Batallas creadas automáticamente',
            batallas: batallasCreadas
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear las batallas automáticamente' });
    }
};

BatallaCtrl.crear = async (req, res) => {
    try {
        const { peleadorAzulId, peleadorRojoId } = req.body;

        // Verificar si los gallos existen
        const peleadorAzul = await Gallo.findById(peleadorAzulId);
        const peleadorRojo = await Gallo.findById(peleadorRojoId);

        if (!peleadorAzul || !peleadorRojo) {
            return res.status(404).json({ mensaje: 'No se encontraron los gallos' });
        }

        // Verificar si los pesos de los gallos son similares
        const pesoAzul = peleadorAzul.peso;
        const pesoRojo = peleadorRojo.peso;

        const margenPeso = 0.1; // Margen de peso permitido para considerarlos similares

        if (Math.abs(pesoAzul - pesoRojo) > margenPeso) {
            return res.status(400).json({ mensaje: 'Los gallos no tienen pesos similares' });
        }

        // Crear la batalla
        const nuevaBatalla = new Batalla({
            peleadorAzul: peleadorAzulId,
            peleadorRojo: peleadorRojoId,
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
        const batallas = await Batalla.find()
            .populate('peleadorAzul', 'cuerda') // Popula los datos del gallo azul (solo muestra la cuerda)
            .populate('peleadorRojo', 'cuerda') // Popula los datos del gallo rojo (solo muestra la cuerda)
            .populate('ganador', 'cuerda'); // Popula los datos del gallo ganador (solo muestra la cuerda)

        res.json(batallas);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la lista de batallas' });
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

    // Actualizar el ganador de la batalla
    batalla.ganador = ganadorId;

    // Incrementar el campo "ganadas" del gallo ganador
    await Gallo.findByIdAndUpdate(ganadorId, { $inc: { ganadas: 1 }, $push: { tiempo } });

    // Incrementar el campo "perdidas" del gallo perdedor
    await Gallo.findByIdAndUpdate(perdedorId, { $inc: { perdidas: 1 }, $push: { tiempo } });

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
        const { batallaId } = req.body;

        // Verificar si la batalla existe
        const batalla = await Batalla.findById(batallaId);

        if (!batalla) {
            return res.status(404).json({ mensaje: 'Batalla no encontrada' });
        }

        // Actualizar el ganador de la batalla como empate (null en ambos peleadores)
        batalla.ganador = null;

        // Incrementar el campo "tablas" en ambos gallos
        const Gallo = require('../models/Gallo');
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
