const mongoose = require('mongoose');

// Asegúrate de que el campo 'estado' sea un Booleano en tu modelo
const eventoSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  fecha: Date,
  hora: String,
  imagen: String,
  estado: { type: Boolean, default: false }, // Asegúrate de que sea booleano
});

const Evento = mongoose.model('Evento', eventoSchema);


module.exports = Evento;
