const mongoose = require('mongoose');
const { Schema } = mongoose;

const AdminSchema = new Schema({
    user: {
        type: String,
        required: [true, 'El usuario es obligatorio']
    },
    contrasena: {
        type: String,
        required: [true, 'El contrasena es obligatorio']
    },
    gallos: [{
        type: Schema.Types.ObjectId,
        ref: 'Gallo'
    }],
    batallas: [{
        type: Schema.Types.ObjectId,
        ref: 'Batalla'
    }]
});

module.exports = mongoose.model('Admin', AdminSchema);

