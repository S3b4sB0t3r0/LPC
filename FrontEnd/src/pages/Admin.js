import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import '../styles/Admin.css';

function Admin() {
  const [usuarios, setUsuarios] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [teatros, setTeatros] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [activeSection, setActiveSection] = useState('usuarios');
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 6;

  
  // Estados de búsqueda
  const [searchQueryUsuarios, setSearchQueryUsuarios] = useState('');
  const [searchQueryEventos, setSearchQueryEventos] = useState('');
  const [searchQueryTeatros, setSearchQueryTeatros] = useState('');
  const [searchQueryContactos, setSearchQueryContactos] = useState('');
  const [searchQueryReservas, setSearchQueryReservas] = useState('');

  // Etsados de Ventana Modal 
  const [editTeatro, setEditTeatro] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editEvento, setEditEvento] = useState(null);
  const [isEditEventModalOpen, setEditEventModalOpen] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const usuariosResponse = await fetch(`${backendUrl}/Usuarios`);
      if (!usuariosResponse.ok) throw new Error('Error al cargar usuarios');
      setUsuarios(await usuariosResponse.json());

      const eventosResponse = await fetch(`${backendUrl}/eventos`);
      if (!eventosResponse.ok) throw new Error('Error al cargar eventos');
      setEventos(await eventosResponse.json());

      const teatrosResponse = await fetch(`${backendUrl}/teatros`);
      if (!teatrosResponse.ok) throw new Error('Error al cargar teatros');
      setTeatros(await teatrosResponse.json());

      const contactosResponse = await fetch(`${backendUrl}/contactos`);
      if (!contactosResponse.ok) throw new Error('Error al cargar contactos');
      setContactos(await contactosResponse.json());

      const reservasResponse = await fetch(`${backendUrl}/reservas`);
      if (!reservasResponse.ok) throw new Error('Error al cargar reservas');
      setReservas(await reservasResponse.json());

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // Función para abrir la modal con la información del teatro
  const openEditModal = (teatro) => {
    setEditTeatro(teatro);
    setEditModalOpen(true);
  };

  // Función para cerrar la modal
  const closeEditModal = () => {
    setEditTeatro(null);
    setEditModalOpen(false);
  };

  // Función para abrir la modal con la información del evento
  const openEditEventModal = (evento) => {
    setEditEvento(evento);
    setEditEventModalOpen(true);
  };

  // Función para cerrar la modal de eventos
  const closeEditEventModal = () => {
    setEditEvento(null);
    setEditEventModalOpen(false);
  };



  const filterData = (data, keys, query) => {
    return data.filter(item =>
      keys.some(key => item[key]?.toLowerCase().includes(query.toLowerCase()))
    );
  };


  // Paginacion 

// Función para cambiar de página
const cambiarPagina = (numeroPagina) => {
  setPaginaActual(numeroPagina);
};

// Filtra los datos de la sección activa y muestra solo los correspondientes a la página actual
const datosSeccionActiva = () => {
  let data = [];
  if (activeSection === 'usuarios') data = usuarios;
  else if (activeSection === 'eventos') data = eventos;
  else if (activeSection === 'teatros') data = teatros;
  else if (activeSection === 'contacto') data = contactos;
  else if (activeSection === 'reservas') data = reservas;

  // Calcular el índice inicial y final de los elementos a mostrar
  const indexOfLastItem = paginaActual * itemsPorPagina;
  const indexOfFirstItem = indexOfLastItem - itemsPorPagina;

  return data.slice(indexOfFirstItem, indexOfLastItem);
};


// Calcula la cantidad de eventos por página y la página actual
const eventosFiltrados = filterData(eventos, ['nombre', 'descripcion'], searchQueryEventos);
const indexOfLastEvento = paginaActual * itemsPorPagina;
const indexOfFirstEvento = indexOfLastEvento - itemsPorPagina;
const eventosActuales = eventosFiltrados.slice(indexOfFirstEvento, indexOfLastEvento);
const totalPaginas = Math.ceil(eventosFiltrados.length / itemsPorPagina);




  // Notificaciones 

  // Estado para la notificación modal
  const [notification, setNotification] = useState({
    isVisible: false,
    message: '',
    type: '', // Puede ser 'success', 'error' o 'confirm'
    onConfirm: null,
  });


  const showNotification = (message, type, onConfirm = null) => {
    setNotification({ isVisible: true, message, type, onConfirm });
  };
  
  const closeNotification = () => {
    setNotification({ isVisible: false, message: '', type: '', onConfirm: null });
  };
  


  // Eventos


  const [newEvento, setNewEvento] = useState({
    nombre: '',
    descripcion: '',
    fecha: '',
    hora: '',
    imagen: '',
    estado: null,
  });

  const handleSubmitEvento = async (e) => {
    e.preventDefault();
    const now = new Date();
    const selectedDateTime = new Date(`${newEvento.fecha}T${newEvento.hora}`);
  
    if (selectedDateTime <= now) {
      showNotification('La fecha y hora deben ser futuras.', 'error');
      return;
    }
  
    // Establecer el estado como false (o null, según tu lógica)
    const eventoAAgregar = { ...newEvento, estado: false };

    try {
      const response = await fetch(`${backendUrl}/eventos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventoAAgregar),
      });
      if (!response.ok) throw new Error('Error al agregar evento');
      setNewEvento({ nombre: '', descripcion: '', fecha: '', hora: '', imagen: '', estado: null });
      showNotification('Evento agregado exitosamente', 'success');
      cargarDatos();
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };
  

  const toggleEstado = async (id) => {
    const evento = eventos.find(e => e._id === id);
    const nuevoEstado = !evento.estado; // Cambia el estado
  
    try {
      const respuesta = await fetch(`${backendUrl}/eventos/${editEvento._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: nuevoEstado }), // Envía el nuevo estado
      });
  
      if (!respuesta.ok) {
        throw new Error('Error al actualizar el estado');
      }
  
      const eventoActualizado = await respuesta.json();
  
      // Actualiza la lista de eventos en el estado local
      setEventos(prevEventos =>
        prevEventos.map(e => (e._id === id ? eventoActualizado : e))
      );
  
      // Muestra una notificación de éxito
      showNotification(
        `Estado del evento ${nuevoEstado ? 'activado' : 'desactivado'} exitosamente`,
        'success'
      );
    } catch (error) {
      console.error(error);
      showNotification('Error al actualizar el estado', 'error');
    }
  };
  
  
  
  // Función para manejar la actualización del evento
  const handleUpdateEvento = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/eventos/${editEvento._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editEvento)
      });
      if (!response.ok) throw new Error('Error al actualizar evento');
  
      showNotification('Evento actualizado exitosamente', 'success');
      cargarDatos();
      closeEditEventModal();
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };
  
  
  

const eliminarEvento = async (id) => {
  showNotification(
    '¿Estás seguro de que deseas eliminar este evento?',
    'confirm',
    async () => {
      try {
        const response = await fetch(`${backendUrl}/eventos/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al eliminar evento');
        setEventos(prevEventos => prevEventos.filter(evento => evento._id !== id));
        showNotification('Evento eliminado exitosamente', 'success');
      } catch (error) {
        showNotification(error.message, 'error');
      }
    }
  );
};



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvento({ ...newEvento, [name]: value });
  };



  // Teatros

  // Estado para el formulario de teatro
  const [newTeatro, setNewTeatro] = useState({
    titulo: '',
    descripcion: '',
    capacidad: '',
    telefono: '',
    direccion: '',
    imagen: '',
    mapa: '',
  });

  const handleInputChangeTeatro = (e) => {
    const { name, value } = e.target;
    setNewTeatro({ ...newTeatro, [name]: value });
  };

  const handleSubmitTeatro = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${backendUrl}/teatros`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTeatro)
      });
      if (!response.ok) throw new Error('Error al agregar teatro');
  
      setNewTeatro({ titulo: '', descripcion: '', capacidad: '', telefono: '', direccion: '', imagen: '', mapa: '' });
      showNotification('Teatro agregado exitosamente', 'success');
      cargarDatos();
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };
  

  const eliminarTeatro = async (id) => {
    showNotification(
      '¿Estás seguro de que deseas eliminar este teatro?',
      'confirm',
      async () => {
        try {
          const response = await fetch(`${backendUrl}/teatros/${id}`, {
            method: 'DELETE',
          });
          if (!response.ok) throw new Error('Error al eliminar teatro');
  
          setTeatros(prevTeatros => prevTeatros.filter(teatro => teatro._id !== id));
          showNotification('Teatro eliminado exitosamente', 'success');
        } catch (error) {
          showNotification(error.message, 'error');
        }
      }
    );
  };
  

  const handleUpdateTeatro = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/teatros/${editTeatro._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editTeatro)
      });
      if (!response.ok) throw new Error('Error al actualizar teatro');
  
      showNotification('Teatro actualizado exitosamente', 'success');
      cargarDatos();
      closeEditModal();
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };
  
  



// Contacto 

const eliminarContacto = async (id) => {
  showNotification(
    '¿Estás seguro de que deseas eliminar este contacto?',
    'confirm',
    async () => {
      try {
        const response = await fetch(`${backendUrl}/contactos/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error al eliminar contacto: ' + await response.text());

        setContactos(prevContactos => prevContactos.filter(contacto => contacto._id !== id));
        showNotification('Contacto eliminado exitosamente', 'success');
      } catch (error) {
        console.error(error);
        showNotification(error.message, 'error');
      }
    }
  );
};



// Reservas


const confirmarReserva = async (id) => {
  try {
    const response = await fetch(`${backendUrl}/reservas/${id}/confirmar`, { method: 'PUT' });
    if (!response.ok) throw new Error('Error al confirmar reserva');

    showNotification('Reserva confirmada y evento creado', 'success');
    cargarDatos(); // Recarga reservas y eventos para reflejar el nuevo evento
  } catch (error) {
    console.error(error);
    showNotification('Error al confirmar la reserva y crear el evento', 'error');
  }
};


const rechazarReserva = async (id) => {
  try {
    const response = await fetch(`${backendUrl}/reservas/${id}/rechazar`, { method: 'PUT' });
    if (!response.ok) throw new Error('Error al rechazar reserva');

    showNotification('Reserva rechazada', 'success');
    cargarDatos(); // Recarga las reservas para reflejar el cambio
  } catch (error) {
    console.error(error);
    showNotification('Error al rechazar la reserva', 'error');
  }
};




const eliminarReserva = async (id) => {
  showNotification(
    '¿Estás seguro de que deseas eliminar esta reserva?',
    'confirm',
    async () => {
      try {
        const response = await fetch(`${backendUrl}/reservas/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error al eliminar reserva');

        setReservas(prevReservas => prevReservas.filter(reserva => reserva._id !== id));
        showNotification('Reserva eliminada exitosamente', 'success');
      } catch (error) {
        console.error(error);
        showNotification(error.message, 'error');
      }
    }
  );
};



  // Usuarios 

  const cambiarEstadoUsuario = async (id, estadoActual) => {
    try {
      const nuevoEstado = !estadoActual;
      const response = await fetch(`${backendUrl}/usuarios/${id}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });
  
      if (!response.ok) {
        throw new Error('Error al cambiar el estado del usuario');
      }
  
      const usuarioActualizado = await response.json();
      setUsuarios((prevUsuarios) =>
        prevUsuarios.map((usuario) =>
          usuario._id === id ? { ...usuario, estado: usuarioActualizado.usuario.estado } : usuario
        )
      );
  
      showNotification(
        `Usuario ${nuevoEstado ? 'activado' : 'desactivado'} exitosamente`,
        'success'
      );
    } catch (error) {
      console.error(error);
      showNotification('Error al cambiar el estado del usuario', 'error');
    }
  };
  






  return (
    <div className="admin-container">
      <nav className="admin-nav">
        <h2>Administración</h2>
        <ul>
          <li><a href="#" onClick={() => setActiveSection('usuarios')}>Usuarios</a></li>
          <li><a href="#" onClick={() => setActiveSection('agregarevento')}>Agregar Evento</a></li>
          <li><a href="#" onClick={() => setActiveSection('eventos')}>Eventos</a></li>
          <li><a href="#" onClick={() => setActiveSection('agregarteatros')}>Agregar Teatros</a></li>
          <li><a href="#" onClick={() => setActiveSection('teatros')}>Teatros</a></li>
          <li><a href="#" onClick={() => setActiveSection('contacto')}>Contactos</a></li>
          <li><a href="#" onClick={() => setActiveSection('reservas')}>Reservas</a></li>
        </ul>
        <br>
        </br>
        <br>
        </br>
        <br>
        </br>
        <br>
        </br>
        <br>
        </br>
        <br>
        </br>
        <br>
        </br>
        <br>
        </br>
        <br>
        </br>
        <br>
        </br>
        <div className="admin-role">
          <p>Rol</p>
          <p>Administrador</p>
        </div>
      </nav>

      <div className="admin-content">
        <h1 className="admin-section-title">Panel de Administración</h1>

        {activeSection === 'usuarios' && (
          <section id="admin-usuarios">
            <h2 className="admin-section-title">Usuarios Registrados</h2>
            <div className="admin-search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="admin-search-input"
                placeholder="Buscar usuarios..."
                value={searchQueryUsuarios}
                onChange={(e) => setSearchQueryUsuarios(e.target.value)}
              />
            </div>
            <table className="admin-table" id="admin-usuarios-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
              {filterData(usuarios, ['nombre', 'correo'], searchQueryUsuarios).map((usuario) => (
                <tr key={usuario._id}>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.correo}</td>
                  <td>{usuario.estado ? 'Activo' : 'Inactivo'}</td>
                  <td>
                    <button
                      className={`action-button ${usuario.estado ? 'deactivate-button' : 'activate-button'}`}
                      onClick={() => cambiarEstadoUsuario(usuario._id, usuario.estado)}
                    >
                      {usuario.estado ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </section>
        )}

{activeSection === 'eventos' && (
  <section id="admin-eventos">
    <h2 className="admin-section-title">Eventos Registrados</h2>
    <div className="admin-search-container">
      <FaSearch className="search-icon" />
      <input
        type="text"
        className="admin-search-input"
        placeholder="Buscar eventos..."
        value={searchQueryEventos}
        onChange={(e) => setSearchQueryEventos(e.target.value)}
      />
    </div>
    <table className="admin-table" id="admin-eventos-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Fecha</th>
          <th>Hora</th>
          <th>Estado</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        {eventosActuales.map(evento => {
          const fecha = new Date(evento.fecha);
          const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
          const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);

          return (
            <tr key={evento._id}>
              <td>{evento.nombre}</td>
              <td>{evento.descripcion}</td>
              <td>{fechaFormateada}</td>
              <td>{evento.hora}</td>
              <td>{evento.estado ? 'Activo' : 'Inactivo'}</td>
              <td>
                <div className="action-button-container">
                  <button className="action-button toggle-button" onClick={() => toggleEstado(evento._id)}>
                    {evento.estado ? 'Desactivar' : 'Activar'}
                  </button>
                  <button className="action-button edit-button" onClick={() => openEditEventModal(evento)}>
                    Editar
                  </button>
                  <button className="action-button delete-button" onClick={() => eliminarEvento(evento._id)}>
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>




        {isEditEventModalOpen && (
          <div id="admin-eventos-modal-overlay">
            <div id="admin-eventos-modal-content">
              <h2>Editar Evento</h2>
              <form onSubmit={handleUpdateEvento}>
                <label>Nombre del Evento:</label>
                <input
                  type="text"
                  name="nombre"
                  value={editEvento?.nombre || ''}
                  onChange={(e) => setEditEvento({ ...editEvento, nombre: e.target.value })}
                  required
                />

                <label>Descripción:</label>
                <input
                  type="text"
                  name="descripcion"
                  value={editEvento?.descripcion || ''}
                  onChange={(e) => setEditEvento({ ...editEvento, descripcion: e.target.value })}
                  required
                />

                <label>Fecha:</label>
                <input
                  type="date"
                  name="fecha"
                  value={editEvento?.fecha?.slice(0, 10) || ''}
                  onChange={(e) => setEditEvento({ ...editEvento, fecha: e.target.value })}
                  required
                />

                <label>Hora:</label>
                <input
                  type="time"
                  name="hora"
                  value={editEvento?.hora || ''}
                  onChange={(e) => setEditEvento({ ...editEvento, hora: e.target.value })}
                  required
                />

                <label>Imagen (URL):</label>
                <input
                  type="text"
                  name="imagen"
                  value={editEvento?.imagen || ''}
                  onChange={(e) => setEditEvento({ ...editEvento, imagen: e.target.value })}
                  required
                />

                <button type="submit">Guardar Cambios</button>
                <button type="button" onClick={closeEditEventModal}>Cancelar</button>
              </form>
            </div>
          </div>
        )}

    {/* Controles de paginación */}
    <div className="pagination">
      {Array.from({ length: totalPaginas }, (_, index) => (
        <button
          key={index + 1}
          onClick={() => cambiarPagina(index + 1)}
          className={`pagination-button ${paginaActual === index + 1 ? 'active' : ''}`}
        >
          {index + 1}
        </button>
      ))}
    </div>
  </section>
)}


              {activeSection === 'teatros' && (
                <section id="admin-teatros">
                  <h2 className="admin-section-title">Teatros Registrados</h2>
                  <div className="admin-search-container">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      className="admin-search-input"
                      placeholder="Buscar teatros..."
                      value={searchQueryTeatros}
                      onChange={(e) => setSearchQueryTeatros(e.target.value)}
                    />
                  </div>
                  <table className="admin-table" id="admin-teatros-table">
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Descripción</th>
                        <th>Capacidad</th>
                        <th>Teléfono</th>
                        <th>Acción</th> {/* Nueva columna para las acciones */}
                      </tr>
                    </thead>
                    <tbody>
                      {filterData(teatros, ['titulo', 'descripcion'], searchQueryTeatros).map(teatro => (
                        <tr key={teatro._id}>
                          <td>{teatro.titulo}</td>
                          <td>{teatro.descripcion}</td>
                          <td>{teatro.capacidad}</td>
                          <td>{teatro.telefono}</td>
                          <td>
                            <div className="action-button-container">
                            <button
                                className="action-button edit-button"
                                onClick={() => openEditModal(teatro)}
                              >
                                Editar
                              </button>
                              <button
                                className="action-button delete-button"
                                onClick={() => eliminarTeatro(teatro._id)}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              )}


          {isEditModalOpen && (
            <div id="admin-teatros-modal-overlay">
              <div id="admin-teatros-modal-content">
                <h2>Editar Teatro</h2>
                <form onSubmit={handleUpdateTeatro}>
                  <label>Título:</label>
                  <input
                    type="text"
                    name="titulo"
                    value={editTeatro?.titulo || ''}
                    onChange={(e) => setEditTeatro({ ...editTeatro, titulo: e.target.value })}
                    required
                  />

                  <label>Descripción:</label>
                  <input
                    type="text"
                    name="descripcion"
                    value={editTeatro?.descripcion || ''}
                    onChange={(e) => setEditTeatro({ ...editTeatro, descripcion: e.target.value })}
                    required
                  />

                  <label>Capacidad:</label>
                  <input
                    type="number"
                    name="capacidad"
                    value={editTeatro?.capacidad || ''}
                    onChange={(e) => setEditTeatro({ ...editTeatro, capacidad: e.target.value })}
                    required
                  />

                  <label>Teléfono:</label>
                  <input
                    type="text"
                    name="telefono"
                    value={editTeatro?.telefono || ''}
                    onChange={(e) => setEditTeatro({ ...editTeatro, telefono: e.target.value })}
                    required
                  />

                  <label>Dirección:</label>
                  <input
                    type="text"
                    name="direccion"
                    value={editTeatro?.direccion || ''}
                    onChange={(e) => setEditTeatro({ ...editTeatro, direccion: e.target.value })}
                    required
                  />

                  <label>Imagen (URL):</label>
                  <input
                    type="text"
                    name="imagen"
                    value={editTeatro?.imagen || ''}
                    onChange={(e) => setEditTeatro({ ...editTeatro, imagen: e.target.value })}
                    required
                  />

                  <label>Mapa (URL):</label>
                  <input
                    type="text"
                    name="mapa"
                    value={editTeatro?.mapa || ''}
                    onChange={(e) => setEditTeatro({ ...editTeatro, mapa: e.target.value })}
                    required
                  />

                  <button type="submit">Guardar Cambios</button>
                  <button type="button" onClick={closeEditModal}>Cancelar</button>
                </form>
              </div>
            </div>
          )}



          {activeSection === 'contacto' && (
            <section id="admin-contacto">
              <h2 className="admin-section-title">Contactos Registrados</h2>
              <div className="admin-search-container">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  className="admin-search-input"
                  placeholder="Buscar contactos..."
                  value={searchQueryContactos}
                  onChange={(e) => setSearchQueryContactos(e.target.value)}
                />
              </div>
              <table className="admin-table" id="admin-contactos-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Mensaje</th>
                    <th>Acción</th> {/* Nueva columna para las acciones */}
                  </tr>
                </thead>
                <tbody>
                  {filterData(contactos, ['nombre', 'email'], searchQueryContactos).map(contacto => (
                    <tr key={contacto._id}>
                      <td>{contacto.nombre}</td>
                      <td>{contacto.email}</td>
                      <td>{contacto.mensaje}</td>
                      <td>
                        <button
                          className="action-button delete-button"
                          onClick={() => eliminarContacto(contacto._id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}



          {activeSection === 'reservas' && (
            <section id="admin-reservas">
              <h2 className="admin-section-title">Reservas Realizadas</h2>
              <div className="admin-search-container">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  className="admin-search-input"
                  placeholder="Buscar reservas..."
                  value={searchQueryReservas}
                  onChange={(e) => setSearchQueryReservas(e.target.value)}
                />
              </div>
              <table className="admin-table" id="admin-reservas-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Teatro</th>
                    <th>Tipo de Evento</th>
                    <th>Duración</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filterData(reservas, ['nombre', 'email', 'teatro', 'tipoEvento'], searchQueryReservas).map(reserva => (
                    <tr key={reserva._id}>
                      <td>{reserva.nombre}</td>
                      <td>{reserva.email}</td>
                      <td>{reserva.fecha}</td>
                      <td>{reserva.hora}</td>
                      <td>{reserva.teatro}</td>
                      <td>{reserva.tipoEvento}</td>
                      <td>{reserva.duracion}</td>
                      <td>{reserva.estado || 'Falta'}</td>
                      <td>
                        {reserva.estado === 'confirmada' || reserva.estado === 'rechazada' ? (
                          <button
                            className="action-button delete-button"
                            onClick={() => eliminarReserva(reserva._id)}
                          >
                            Eliminar
                          </button>
                        ) : (
                          <>
                            <button
                              className="action-button confirm-button"
                              onClick={() => confirmarReserva(reserva._id)}
                            >
                              Confirmar
                            </button>
                            <button
                              className="action-button reject-button"
                              onClick={() => rechazarReserva(reserva._id)}
                            >
                              Rechazar
                            </button>
                            <button
                              className="action-button delete-button"
                              onClick={() => eliminarReserva(reserva._id)}
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}


{activeSection === 'agregarevento' && (
          <section id="admin-agregar-evento">
            <h2>Agregar Evento</h2>
            <form onSubmit={handleSubmitEvento} className="admin-event-form">
              <div className="form-row">
                <input
                  type="text"
                  id="evento-nombre"
                  name="nombre"
                  placeholder="Nombre del Evento"
                  value={newEvento.nombre}
                  onChange={handleInputChange}
                  required
                  className="admin-input"
                />
                <input
                  type="text"
                  id="evento-descripcion"
                  name="descripcion"
                  placeholder="Descripción"
                  value={newEvento.descripcion}
                  onChange={handleInputChange}
                  required
                  className="admin-input"
                />
              </div>
              <div className="form-row">
                <input
                  type="date"
                  id="evento-fecha"
                  name="fecha"
                  value={newEvento.fecha}
                  onChange={handleInputChange}
                  required
                  className="admin-input"
                />
                <input
                  type="time"
                  id="evento-hora"
                  name="hora"
                  value={newEvento.hora}
                  onChange={handleInputChange}
                  required
                  className="admin-input"
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  id="evento-imagen"
                  name="imagen"
                  placeholder="URL de la Imagen"
                  value={newEvento.imagen}
                  onChange={handleInputChange}
                  className="admin-input"
                />
              </div>
              <p className="info-text">Nota: El evento se creará como "No disponible".</p>
              <button type="submit" className="admin-submit-button">Agregar Evento</button>
            </form>
          </section>
        )}


{activeSection === 'agregarteatros' && (
          <section id="admin-agregar-teatro">
            <h2>Agregar Teatro</h2>
            <form onSubmit={handleSubmitTeatro} className="admin-teatro-form">
              <div className="form-row">
                <input
                  type="text"
                  id="teatro-titulo"
                  name="titulo"
                  placeholder="Título del Teatro"
                  value={newTeatro.titulo}
                  onChange={handleInputChangeTeatro}
                  required
                  className="admin-input"
                />
                <input
                  type="text"
                  id="teatro-descripcion"
                  name="descripcion"
                  placeholder="Descripción"
                  value={newTeatro.descripcion}
                  onChange={handleInputChangeTeatro}
                  required
                  className="admin-input"
                />
              </div>
              <div className="form-row">
                <input
                  type="number"
                  id="teatro-capacidad"
                  name="capacidad"
                  placeholder="Capacidad"
                  value={newTeatro.capacidad}
                  onChange={handleInputChangeTeatro}
                  required
                  className="admin-input"
                />
                <input
                  type="text"
                  id="teatro-telefono"
                  name="telefono"
                  placeholder="Teléfono"
                  value={newTeatro.telefono}
                  onChange={handleInputChangeTeatro}
                  required
                  className="admin-input"
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  id="teatro-direccion"
                  name="direccion"
                  placeholder="Dirección"
                  value={newTeatro.direccion}
                  onChange={handleInputChangeTeatro}
                  required
                  className="admin-input"
                />
                <input
                  type="text"
                  id="teatro-imagen"
                  name="imagen"
                  placeholder="URL de Imagen"
                  value={newTeatro.imagen}
                  onChange={handleInputChangeTeatro}
                  required
                  className="admin-input"
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  id="teatro-mapa"
                  name="mapa"
                  placeholder="URL del Mapa"
                  value={newTeatro.mapa}
                  onChange={handleInputChangeTeatro}
                  required
                  className="admin-input"
                />
              </div>
              <button type="submit" className="admin-submit-button">Agregar Teatro</button>
            </form>
          </section>
        )}

{notification.isVisible && (
  <div id="admin-notificaciones-modal-overlay" onClick={closeNotification}>
    <div id="admin-notificaciones-modal" onClick={(e) => e.stopPropagation()}>
      <h2>{notification.type === 'error' ? 'Error' : 'Notificación'}</h2>
      <p>{notification.message}</p>
      <div id="admin-notificaciones-modal-buttons">
        {notification.type === 'confirm' && (
          <button
            id="admin-notificaciones-button-confirm"
            onClick={() => {
              notification.onConfirm && notification.onConfirm();
              closeNotification();
            }}
          >
            Confirmar
          </button>
        )}
        <button id="admin-notificaciones-button-cancel" onClick={closeNotification}>
          Cerrar
        </button>
      </div>
    </div>
  </div>
)}


      </div>
    </div>
  );
}

export default Admin;
