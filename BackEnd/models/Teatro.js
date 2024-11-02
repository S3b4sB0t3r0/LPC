const mongoose = require('mongoose');

const teatroSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  capacidad: { type: Number, required: true },
  telefono: { type: String, required: true },
  direccion: { type: String, required: true },
  imagen: { type: String, required: true },
  mapa: { type: String, required: true },
});

const Teatro = mongoose.model('Teatro', teatroSchema);

module.exports = Teatro;
