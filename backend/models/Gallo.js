const mongoose= require('mongoose')
const {Schema} = mongoose

const GalloSchema = new Schema ({
    cuerda: {
        type: String,
        required: true
      },
      frente: {
        type: Number,
        required: true
      },
      ciudad: {
        type: String,
        required: true
      },
      color: {
        type: String,
        required: true
      },
      peso: {
        type: Number,
        required: true
      },
      jaula: {
        type: Number,
        required: true
      },
      marca: {
        type: Number,
        required: true
      },
      tipo: {
        type: String,
        required: true
      },
      placa: {
        type: Number,
        required: true
      },
      anillo: {
        type: Number,
        required: true
      },
      ganadas: {
        type: Number
      },
      tablas: {
        type: Number
      },
      tiempo: {
        type: Array
      },
      perdidas: {
        type: Number
      }
})

module.exports = mongoose.model('gallo', GalloSchema)