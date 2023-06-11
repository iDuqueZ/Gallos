const mongoose = require('mongoose')
const {model, Schema} = mongoose

const adminSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = model('Admin', adminSchema);
