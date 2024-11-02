const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mensaje: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Contacto', contactSchema);
