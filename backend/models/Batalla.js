const mongoose = require('mongoose');

const batallaSchema = new mongoose.Schema({
    peleadorAzul: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gallo',
        required: true
    },
    peleadorRojo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gallo',
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now,
        required: true
    },
    ganador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gallo'
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
    }
});

const Batalla = mongoose.model('Batalla', batallaSchema);

module.exports = Batalla;
