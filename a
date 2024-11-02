const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  sendResetEmail,
  sendContactEmail,
  sendReservationEmail,
  conReservationEmail,
  sendRejectionEmail
} = require('./testEmail');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const SECRET_KEY = 'tu_clave_secreta_para_JWT'; // Cambia esto por una clave más segura en producción

// Función para cargar la base de datos (db.json)
function loadDB() {
  const data = fs.readFileSync('db.json', 'utf-8');
  return JSON.parse(data);
}

// Función para guardar en la base de datos (db.json)
function saveDB(db) {
  fs.writeFileSync('db.json', JSON.stringify(db, null, 2), 'utf-8');
}

// Ruta para obtener los usuarios
app.get('/Usuarios', (req, res) => {
  const db = loadDB();
  res.json(db.Usuarios || []);
});

// Ruta para registrar un nuevo usuario
app.post('/Usuarios', async (req, res) => {
  const db = loadDB();
  const { nombre, correo, contraseña } = req.body;

  const userExists = db.Usuarios.find(user => user.correo === correo);
  if (userExists) {
    return res.status(400).json({ message: 'El correo ya está registrado' });
  }

  if (contraseña.length < 6) {
    return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
  }

  const hashedPassword = await bcrypt.hash(contraseña, 10);
  const newUser = { id: Date.now().toString(), nombre, correo, contraseña: hashedPassword };
  db.Usuarios.push(newUser);
  saveDB(db);

  const token = jwt.sign({ id: newUser.id, nombre: newUser.nombre }, SECRET_KEY);
  res.status(201).json({ message: 'Usuario registrado exitosamente', token });
});

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
  const db = loadDB();
  const { correo, contraseña } = req.body;

  const user = db.Usuarios.find(user => user.correo === correo);
  if (!user) {
    return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
  }

  const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
  }

  const token = jwt.sign({ id: user.id, nombre: user.nombre }, SECRET_KEY);
  res.status(200).json({ message: 'Inicio de sesión exitoso', token, nombre: user.nombre, correo: user.correo });
});

// Ruta para obtener información del usuario
app.get('/user', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden

    const db = loadDB();
    const foundUser = db.Usuarios.find(u => u.id === user.id);

    if (!foundUser) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.json({
      nombre: foundUser.nombre,
      correo: foundUser.correo,
    });
  });
});

// Ruta para realizar una reserva
app.post('/reservas', async (req, res) => {
  const db = loadDB();
  const { nombre, email, fecha, hora, teatro, tipoEvento, duracion, imagenUrl } = req.body;

  // Asegúrate de que Reservas esté inicializado
  db.Reservas = db.Reservas || [];

  const newReserva = {
    id: Date.now().toString(),
    nombre,
    email,
    fecha,
    hora,
    teatro,
    tipoEvento,
    duracion,
    imagenUrl,
    estado: null, // Cambiado de 'aprobada' y 'rechazada' a 'estado' inicializado como null
  };

  db.Reservas.push(newReserva);
  saveDB(db);

  try {
    await sendReservationEmail(email); // Envía el correo de confirmación
    res.status(201).json({ message: 'Reserva creada exitosamente', reserva: newReserva });
  } catch (error) {
    console.error('Error al enviar el correo de reserva:', error);
    res.status(500).json({ message: 'Reserva creada, pero hubo un problema enviando el correo.' });
  }
});


// Ruta para aprobar una reserva
app.post('/aprobarReserva/:id', async (req, res) => {
  const db = loadDB();
  const reservaId = req.params.id;

  const reserva = db.Reservas.find(reserva => reserva.id === reservaId);

  if (!reserva) {
    return res.status(404).json({ message: 'Reserva no encontrada.' });
  }

  if (reserva.estado === 'aprobada') {
    return res.status(400).json({ message: 'La reserva ya ha sido aprobada.' });
  }

  reserva.estado = 'aprobada'; // Cambiado a 'estado'
  saveDB(db); // Guarda el cambio en la base de datos

  try {
    await conReservationEmail(reserva.email); // Envía el correo de confirmación
    res.status(200).json({ message: 'Reserva aprobada y correo enviado.', reserva });
  } catch (error) {
    console.error('Error al enviar el correo de confirmación de reserva:', error);
    res.status(500).json({ message: 'Reserva aprobada, pero no se pudo enviar el correo.' });
  }
});

// Ruta para confirmar una reserva y crear un evento
app.post('/Reservas/:id/confirmar', async (req, res) => {
  const db = loadDB();
  const reservaId = req.params.id;

  const reserva = db.Reservas.find(reserva => reserva.id === reservaId);

  if (!reserva) {
    return res.status(404).json({ message: 'Reserva no encontrada.' });
  }

  if (reserva.aprobada) {
    return res.status(400).json({ message: 'La reserva ya ha sido confirmada.' });
  }

  // Crear un nuevo evento basado en la reserva
  const newEvento = {
    id: Date.now().toString(),
    nombre: `Evento de ${reserva.nombre} - ${reserva.tipoEvento}`,
    imagen: reserva.imagenUrl,
    fecha: reserva.fecha,
    hora: reserva.hora,
    descripcion: `Evento reservado por ${reserva.nombre}`,
    disponible: true,
  };

  // Agregar el nuevo evento a la base de datos
  db.Eventos = db.Eventos || [];
  db.Eventos.push(newEvento);

  // Marcar la reserva como aprobada
  reserva.aprobada = true;
  saveDB(db); // Guarda los cambios en la base de datos

  try {
    await conReservationEmail(reserva.email); // Envía el correo de confirmación
    res.status(200).json({ message: 'Reserva confirmada y correo enviado.', reserva, evento: newEvento });
  } catch (error) {
    console.error('Error al enviar el correo de confirmación de reserva:', error);
    res.status(500).json({ message: 'Reserva confirmada, pero no se pudo enviar el correo.' });
  }
});

// Ruta para rechazar una reserva
app.post('/reservas/:id/rechazar', async (req, res) => {
  const db = loadDB();
  const reservaId = req.params.id;

  const reserva = db.Reservas.find(reserva => reserva.id === reservaId);

  if (!reserva) {
    return res.status(404).json({ message: 'Reserva no encontrada.' });
  }

  if (reserva.estado === 'rechazada') {
    return res.status(400).json({ message: 'La reserva ya ha sido rechazada.' });
  }

  reserva.estado = 'rechazada'; // Cambiado a 'estado'
  saveDB(db); // Guarda el cambio en la base de datos

  try {
    await sendRejectionEmail(reserva.email); // Envía el correo de rechazo
    res.status(200).json({ message: 'Reserva rechazada y correo enviado.', reserva });
  } catch (error) {
    console.error('Error al enviar el correo de rechazo de reserva:', error);
    res.status(500).json({ message: 'Reserva rechazada, pero no se pudo enviar el correo.' });
  }
});

// Ruta para obtener reservas de un usuario
app.get('/reservas/:userId', (req, res) => {
  const db = loadDB();
  const { userId } = req.params;

  const reservas = db.Reservas.filter(reserva => reserva.userId === userId);
  res.json(reservas);
});

// Ruta para recuperar la contraseña
app.post('/restablecer', async (req, res) => {
  const { email } = req.body;
  const db = loadDB();
  const user = db.Usuarios.find(u => u.correo === email);

  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado.' });
  }

  const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
  const resetLink = `http://localhost:3000/restablecer/${token}`;

  try {
    await sendResetEmail(email, resetLink);
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

    const db = loadDB();
    const user = db.Usuarios.find(u => u.id === decoded.id);

    if (!user) {
      return res.status(404).send('Usuario no encontrado.');
    }

    const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);
    user.contraseña = hashedPassword;
    saveDB(db);

    res.send('Contraseña actualizada exitosamente.');
  });
});

// Ruta de contacto
app.post('/contacto', async (req, res) => {
  const { nombre, email, mensaje } = req.body;

  // Validaciones simples
  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ message: 'Por favor, completa todos los campos.' });
  }

  const db = loadDB();
  const newContact = { id: Date.now().toString(), nombre, email, mensaje };

  db.Contactos = db.Contactos || [];
  db.Contactos.push(newContact);
  saveDB(db);

  try {
    await sendContactEmail(email); // Envía el correo de confirmación
    res.json({ message: 'Mensaje recibido y almacenado. Nos pondremos en contacto pronto.' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ message: 'Error al enviar el correo.' });
  }
});


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
