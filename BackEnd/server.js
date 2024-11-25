const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  sendResetEmail,
  sendContactEmail,
  sendReservationEmail,
  conReservationEmail,
  sendRejectionEmail,
  sendRegistrationEmail
} = require('./testEmail');  // Aquí se importan las funciones de envío de correo desde testEmail.js
require("dotenv").config();


const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());


const SECRET_KEY = process.env.SECRET_KEY;



// Lista de dominios permitidos (incluyendo Vercel, Render y localhost para desarrollo)
const allowedOrigins = [
  'https://lpc-colombia-nqnipqdjy-sebaspro22210-gmailcoms-projects.vercel.app',  // Dominio de Vercel
  'https://lpc-colombia.onrender.com', // Dominio de Render (backend desplegado)
  'http://localhost:3000', // Para desarrollo local en React (puedes cambiar el puerto si usas otro)
];

const corsOptions = {
  origin: (origin, callback) => {
    // Permitir orígenes de la lista de orígenes permitidos
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  credentials: true, // Si estás usando cookies o autenticación por sesión, debe ser true
};

app.use(cors(corsOptions));




// Conexión a MongoDB Atlas
const mongoURI = process.env.MONGO_URI || "mongodb+srv://logisticacolombianalpc:W0wddLtapyQcAHrR@lpc-colombia.ndyk7.mongodb.net/LPC_COLOMBIA?retryWrites=true&w=majority";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conexión exitosa a MongoDB Atlas");
  })
  .catch((err) => {
    console.error("Error conectándose a MongoDB Atlas:", err);
  });



// Esquema de usuarios
const userSchema = new mongoose.Schema({
  nombre: String,
  correo: String,
  contraseña: String,
  estado: { type: Boolean, default: true },
});

// Esquema de reservas
const reservaSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  fecha: String,
  hora: String,
  teatro: String,
  tipoEvento: String,
  duracion: String,
  imagenUrl: String,
  estado: { type: String, default: null },
});

// Esquema de contactos
const contactSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  mensaje: String,
});

// Asegúrate de que el campo 'estado' sea un Booleano en tu modelo
const eventoSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  fecha: Date,
  hora: String,
  imagen: String,
  estado: { type: Boolean, default: false }, // Asegúrate de que sea booleano
});




// Esquema de teatros
const teatroSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  capacidad: { type: Number, required: true },
  telefono: { type: String, required: true },
  direccion: { type: String, required: true },
  imagen: { type: String, required: true },
  mapa: { type: String, required: true },
});

// Modelos
const Teatro = mongoose.model('Teatro', teatroSchema);
const Usuario = mongoose.model('Usuario', userSchema);
const Reserva = mongoose.model('Reserva', reservaSchema);
const Contacto = mongoose.model('Contacto', contactSchema);
const Evento = mongoose.model('Evento', eventoSchema);

// Ruta para obtener los usuarios
app.get('/Usuarios', async (req, res) => {
  const usuarios = await Usuario.find();
  res.json(usuarios);
});

// Ruta para registrar un nuevo usuario
app.post('/Usuarios', async (req, res) => {
  const { nombre, correo, contraseña } = req.body;

  // Verificar si el correo ya está registrado
  const userExists = await Usuario.findOne({ correo });
  if (userExists) {
    return res.status(400).json({ message: 'El correo ya está registrado' });
  }

  // Validar que la contraseña tenga al menos 6 caracteres
  if (contraseña.length < 6) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
  }

  try {
    // Encriptar la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const newUser = new Usuario({ nombre, correo, contraseña: hashedPassword });

    // Guardar el nuevo usuario en la base de datos
    await newUser.save();

    // Crear un token de autenticación
    const token = jwt.sign({ id: newUser._id, nombre: newUser.nombre }, SECRET_KEY);

    // Enviar el correo de confirmación de registro
    await sendRegistrationEmail(correo, nombre); // Llamada a la función para enviar el correo

    // Responder con el mensaje de éxito
    res.status(201).json({ message: 'Usuario registrado exitosamente', token });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ message: 'Error al registrar el usuario.' });
  }
});


// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
  const { correo, contraseña } = req.body;

  // Verificar que los campos no estén vacíos
  if (!correo || !contraseña) {
    return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
  }

  const user = await Usuario.findOne({ correo });
  if (!user) {
    return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
  }

  const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
  }

  const token = jwt.sign({ id: user._id, nombre: user.nombre }, process.env.SECRET_KEY);

  return res.status(200).json({
    message: 'Inicio de sesión exitoso',
    token,
    nombre: user.nombre,
    correo: user.correo,
  });
});




// Ruta para obtener información del usuario
app.get('/user', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, SECRET_KEY, async (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden

    const foundUser = await Usuario.findById(user.id);

    if (!foundUser) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.json({
      nombre: foundUser.nombre,
      correo: foundUser.correo,
    });
  });
});

app.post('/reservas', async (req, res) => {
  const { nombre, email, fecha, hora, teatro, tipoEvento, duracion, imagenUrl } = req.body;

  // Validar que la fecha de la reserva sea al menos 2 días en el futuro
  const fechaReserva = new Date(`${fecha}T${hora}`);
  const fechaActual = new Date();
  const diferenciaDias = (fechaReserva - fechaActual) / (1000 * 60 * 60 * 24); // Diferencia en días

  if (diferenciaDias < 2) {
    return res.status(400).json({ message: 'La reserva debe realizarse al menos con 2 días de anticipación.' });
  }

  const newReserva = new Reserva({
    nombre,
    email,
    fecha,
    hora,
    teatro,
    tipoEvento,
    duracion,
    imagenUrl,
  });

  try {
    await newReserva.save();
    // Enviar correo de confirmación
    await sendReservationEmail(email, nombre, teatro, fecha, hora);
    res.status(201).json({ message: 'Reserva creada exitosamente', reserva: newReserva });
  } catch (error) {
    console.error('Error al enviar el correo de reserva:', error);
    res.status(500).json({ message: 'Reserva creada, pero hubo un problema enviando el correo.' });
  }
});



// Ruta para aprobar una reserva
app.post('/aprobarReserva/:id', async (req, res) => {
  const reservaId = req.params.id;
  const reserva = await Reserva.findById(reservaId);

  if (!reserva) {
    return res.status(404).json({ message: 'Reserva no encontrada.' });
  }

  if (reserva.estado === 'aprobada') {
    return res.status(400).json({ message: 'La reserva ya ha sido aprobada.' });
  }

  reserva.estado = 'aprobada'; // Cambiado a 'estado'
  await reserva.save();

  try {
    await conReservationEmail(reserva.email); // Envía el correo de confirmación
    res.status(200).json({ message: 'Reserva aprobada y correo enviado.', reserva });
  } catch (error) {
    console.error('Error al enviar el correo de confirmación de reserva:', error);
    res.status(500).json({ message: 'Reserva aprobada, pero no se pudo enviar el correo.' });
  }
});

// Ruta para rechazar una reserva
app.post('/reservas/:id/rechazar', async (req, res) => {
  const reservaId = req.params.id;
  const reserva = await Reserva.findById(reservaId);

  if (!reserva) {
    return res.status(404).json({ message: 'Reserva no encontrada.' });
  }

  if (reserva.estado === 'rechazada') {
    return res.status(400).json({ message: 'La reserva ya ha sido rechazada.' });
  }

  reserva.estado = 'rechazada'; // Cambiado a 'estado'
  await reserva.save();

  try {
    await sendRejectionEmail(reserva.email); // Envía el correo de rechazo
    res.status(200).json({ message: 'Reserva rechazada y correo enviado.', reserva });
  } catch (error) {
    console.error('Error al enviar el correo de rechazo de reserva:', error);
    res.status(500).json({ message: 'Reserva rechazada, pero no se pudo enviar el correo.' });
  }
});

app.post('/contacto', async (req, res) => {
  const { nombre, email, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    console.error('Error: Faltan campos requeridos');
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  try {
    const newContact = new Contacto({ nombre, email, mensaje });
    await newContact.save(); // Intento de guardar en MongoDB
    console.log('Mensaje guardado en la base de datos');

    try {
      await sendContactEmail(email, nombre, mensaje); // Intento de enviar el correo
      console.log('Correo enviado exitosamente');
      res.status(201).json({ message: 'Mensaje recibido y almacenado. Nos pondremos en contacto pronto.' });
    } catch (error) {
      console.error('Error al enviar el correo:', error.message);
      res.status(500).json({ message: 'Error al enviar el correo.' });
    }
  } catch (error) {
    console.error('Error al guardar en la base de datos:', error.message);
    res.status(500).json({ message: 'Error al guardar el mensaje en la base de datos.' });
  }
});



// Ruta para recuperar la contraseña
app.post('/restablecer', async (req, res) => {
  const { email } = req.body;

  const user = await Usuario.findOne({ correo: email });
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado.' });
  }

  const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
  const resetLink = `http://localhost:3000/restablecer/${token}`;

  try {
    // Pasa el nombre del usuario al enviar el correo
    await sendResetEmail(email, user.nombre, resetLink);
    res.json({ message: 'Se ha enviado un enlace para restablecer tu contraseña.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al enviar el correo.' });
  }
});


// Ruta para verificar el token (GET)
app.get('/restablecer/:token', (req, res) => {
  const token = req.params.token;

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send('Token inválido o expirado.');
    }
    res.status(200).json({ message: 'Token válido', userId: decoded.id });
  });
});

// Ruta para actualizar la contraseña (POST)
app.post('/restablecer/:token', async (req, res) => {
  const token = req.params.token;
  const { nuevaContraseña } = req.body;

  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(401).send('Token inválido o expirado.');
    }

    const user = await Usuario.findById(decoded.id); // Usar Mongoose directamente

    if (!user) {
      return res.status(404).send('Usuario no encontrado.');
    }

    const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);
    user.contraseña = hashedPassword;
    await user.save(); // Guardar cambios en la base de datos

    res.send('Contraseña actualizada exitosamente.');
  });
});



// Ruta para obtener las reservas del usuario autenticado
app.get('/reservas/misReservas', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, SECRET_KEY, async (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden

    try {
      // Busca las reservas que coinciden con el correo del usuario
      const reservas = await Reserva.find({ email: user.correo });

      // Solo devuelve las reservas si hay alguna, de lo contrario no devuelve nada
      if (reservas.length === 0) {
        return res.status(204).send(); // No Content
      }

      res.json(reservas);
    } catch (error) {
      console.error('Error al obtener las reservas del usuario:', error);
      res.status(500).json({ message: 'Error al obtener las reservas del usuario' });
    }
  });
});




// FrontEnd Admin 

// Usuarios

// Ruta para actualizar el estado de un usuario
app.put('/usuarios/:id/estado', async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body; // true o false

  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(id, { estado }, { new: true });
    if (!usuarioActualizado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Estado del usuario actualizado exitosamente', usuario: usuarioActualizado });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el estado del usuario', error });
  }
});



// Ruta para obtener solo el usuario y correo de todos los usuarios registrados
app.get('/Usuarios', async (req, res) => {
  try {
    // Encuentra todos los usuarios, pero solo selecciona los campos 'nombre' y 'correo'
    const usuarios = await Usuario.find().select('nombre correo');
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
});


// Ruta para agregar un evento
app.post('/eventos', async (req, res) => {
  const { nombre, descripcion, fecha, hora, imagen } = req.body;

  const selectedDateTime = new Date(`${fecha}T${hora}`);
  const now = new Date();

  if (selectedDateTime <= now) {
    return res.status(400).json({ message: 'La fecha y hora deben ser futuras.' });
  }

  const newEvento = new Evento({
    nombre,
    descripcion,
    fecha,
    hora,
    imagen,
    // el estado ya está configurado por defecto en el modelo
  });

  try {
    await newEvento.save();
    res.status(201).json({ message: 'Evento agregado exitosamente', evento: newEvento });
  } catch (error) {
    console.error('Error al agregar evento:', error);
    res.status(500).json({ message: 'Error al agregar evento', error });
  }
});


// Ruta para obtener todos los eventos, incluyendo el estado
app.get('/eventos', async (req, res) => {
  try {
    // Encuentra todos los eventos y selecciona los campos necesarios, incluyendo 'estado'
    const eventos = await Evento.find().select('nombre descripcion fecha hora imagen estado');
    res.json(eventos);
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({ message: 'Error al obtener los eventos' });
  }
});





// Ruta para agregar un teatro
app.post('/teatros', async (req, res) => {
  const { titulo, descripcion, capacidad, telefono, direccion, imagen, mapa, id } = req.body;

  const newTeatro = new Teatro({
    titulo,
    descripcion,
    capacidad,
    telefono,
    direccion,
    imagen,
    mapa,
  });

  try {
    await newTeatro.save();
    res.status(201).json({ message: 'Teatro agregado exitosamente', teatro: newTeatro });
  } catch (error) {
    console.error('Error al agregar teatro:', error);
    res.status(500).json({ message: 'Error al agregar teatro', error });
  }
});

// Ruta para obtener todos los teatros
app.get('/teatros', async (req, res) => {
  try {
    const teatros = await Teatro.find();
    res.json(teatros);
  } catch (error) {
    console.error('Error al obtener teatros:', error);
    res.status(500).json({ message: 'Error al obtener teatros' });
  }
});

// Ruta para obtener todas las reservas
app.get('/reservas', async (req, res) => {
  try {
    const reservas = await Reserva.find();
    res.json(reservas);
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({ message: 'Error al obtener reservas' });
  }
});

// Ruta para obtener todos los contactos
app.get('/contactos', async (req, res) => {
  try {
    const contactos = await Contacto.find();
    res.json(contactos);
  } catch (error) {
    console.error('Error al obtener contactos:', error);
    res.status(500).json({ message: 'Error al obtener contactos' });
  }
});




// Ruta para cambiar el estado de un evento
app.put('/api/eventos/:id', async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const eventoActualizado = await Evento.findByIdAndUpdate(id, { estado }, { new: true });
    if (!eventoActualizado) return res.status(404).json({ error: 'Evento no encontrado' });
    res.json(eventoActualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el evento' });
  }
});

// Ruta para editar un evento
app.put('/eventos/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body; // Datos actualizados del evento

  try {
    // Busca el evento por ID y actualiza con los datos recibidos
    const eventoActualizado = await Evento.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!eventoActualizado) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    res.json({ message: 'Evento actualizado exitosamente', evento: eventoActualizado });
  } catch (error) {
    console.error('Error al actualizar evento:', error);
    res.status(500).json({ message: 'Error al actualizar el evento' });
  }
});



// Eliminar Teatro
app.delete('/teatros/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Teatro.findByIdAndDelete(id); // Cambiar TeatroModel a Teatro
    if (!result) return res.status(404).send('Teatro no encontrado');
    res.status(200).send('Teatro eliminado');
  } catch (error) {
    res.status(500).send('Error al eliminar teatro');
  }
});

// Editar Teatro 
app.put('/teatros/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const teatroActualizado = await Teatro.findByIdAndUpdate(id, updateData, { new: true });
    if (!teatroActualizado) return res.status(404).json({ message: 'Teatro no encontrado' });
    res.json({ message: 'Teatro actualizado exitosamente', teatro: teatroActualizado });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar teatro' });
  }
});




// Eliminar contacto
app.delete('/contactos/:id', async (req, res) => {
  try {
      const contacto = await Contacto.findById(req.params.id);
      if (!contacto) return res.status(404).send('Contacto no encontrado');

      // En lugar de contacto.remove(), usa findByIdAndDelete
      await Contacto.findByIdAndDelete(req.params.id);
      res.json({ message: 'Contacto eliminado' });
  } catch (error) {
      console.error('Error al eliminar contacto:', error);
      res.status(500).json({ message: 'Error al eliminar contacto', error: error.message });
  }
});


// Reservas


// Ruta para confirmar una reserva y crear un evento
app.put('/reservas/:id/confirmar', async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id);
    if (!reserva) return res.status(404).json({ message: 'Reserva no encontrada' });

    // Cambia el estado de la reserva a confirmada
    reserva.estado = 'confirmada';
    await reserva.save();

    // Crear un nuevo evento con los datos de la reserva
    const nuevoEvento = new Evento({
      nombre: reserva.nombre,
      descripcion: `Evento para ${reserva.tipoEvento}`,
      fecha: new Date(`${reserva.fecha}T${reserva.hora}`),
      hora: reserva.hora,
      imagen: reserva.imagenUrl, // Usa la URL de imagen de la reserva si existe
      estado: true, // Puedes ajustar esto según el estado inicial deseado
    });

    await nuevoEvento.save(); // Guarda el nuevo evento en la base de datos

    // Envía el correo de confirmación de la reserva con detalles
    await conReservationEmail(reserva.email, reserva.nombre, reserva.teatro, reserva.fecha, reserva.hora);

    res.status(200).json({ message: 'Reserva confirmada, evento creado y correo enviado.' });
  } catch (error) {
    console.error('Error al confirmar la reserva y crear el evento:', error);
    res.status(500).json({ message: 'Error al confirmar la reserva y crear el evento.' });
  }
});


// Ruta para rechazar una reserva
app.put('/reservas/:id/rechazar', async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id);
    if (!reserva) return res.status(404).json({ message: 'Reserva no encontrada' });

    reserva.estado = 'rechazada';
    await reserva.save();

    // Envía el correo de rechazo de la reserva con detalles
    await sendRejectionEmail(reserva.email, reserva.nombre, reserva.teatro, reserva.fecha, reserva.hora);

    res.status(200).json({ message: 'Reserva rechazada y correo enviado.' });
  } catch (error) {
    console.error('Error al rechazar la reserva:', error);
    res.status(500).json({ message: 'Error al rechazar la reserva.' });
  }
});

// Ruta para eliminar una reserva
app.delete('/reservas/:id', async (req, res) => {
  try {
      const reserva = await Reserva.findById(req.params.id);
      if (!reserva) return res.status(404).send('Reserva no encontrada');

      await Reserva.findByIdAndDelete(req.params.id);
      res.json({ message: 'Reserva eliminada exitosamente' });
  } catch (error) {
      console.error('Error al eliminar reserva:', error);
      res.status(500).json({ message: 'Error al eliminar reserva', error: error.message });
  }
});



// Ruta para eliminar un evento
app.delete('/eventos/:id', async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) return res.status(404).send('Evento no encontrado');

    await Evento.findByIdAndDelete(req.params.id);
    res.json({ message: 'Evento eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    res.status(500).json({ message: 'Error al eliminar evento', error: error.message });
  }
});




// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
