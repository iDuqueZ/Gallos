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
  }
});

const Batalla = mongoose.model('Batalla', batallaSchema);

module.exports = Batalla;
