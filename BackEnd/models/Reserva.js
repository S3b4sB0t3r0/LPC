const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true },
  fecha: { type: String, required: true },
  hora: { type: String, required: true },
  teatro: { type: String, required: true },
  tipoEvento: { type: String, required: true },
  duracion: { type: String, required: true },
  imagenUrl: { type: String },
  estado: { type: String, default: null }, // Aprobada, Rechazada, etc.
});

const Reserva = mongoose.model('Reserva', reservaSchema);

module.exports = Reserva;
