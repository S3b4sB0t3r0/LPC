import React, { useState, useEffect } from 'react';
import '../styles/Teatros.css';

function Teatros() {
  const [teatros, setTeatros] = useState([]);
  const [teatroSeleccionado, setTeatroSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const teatrosPorPagina = 6;

  // Usa la variable de entorno para la URL del backend
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const cargarTeatros = async () => {
      try {
        const response = await fetch(`${API_URL}/teatros`);
        if (!response.ok) {
          throw new Error('Error al obtener los teatros');
        }
        const data = await response.json();
        // Asegúrate de que 'estado' es un booleano
        const teatrosConDisponibilidad = data.map(teatro => ({
          ...teatro,
          disponible: teatro.estado, // Asegúrate de que esto se alinee con tu esquema
        }));
        setTeatros(teatrosConDisponibilidad);
      } catch (error) {
        console.error('Error al cargar los teatros:', error);
      }
    };

    cargarTeatros();
  }, [API_URL]);

  const abrirModal = (teatro) => {
    setTeatroSeleccionado(teatro);
  };

  const cerrarModal = () => {
    setTeatroSeleccionado(null);
  };

  const handleReservar = async () => {
    if (teatroSeleccionado) {
      try {
        // Actualizar el estado del teatro a no disponible
        await fetch(`${API_URL}/api/teatros/${teatroSeleccionado._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ estado: false }), // Cambiar a no disponible
        });
        // Redirigir al sitio de reserva del teatro o a una página de pago
        alert('Reserva realizada con éxito');
      } catch (error) {
        console.error('Error al actualizar el estado del teatro:', error);
      }
    }
  };

  const teatrosFiltrados = teatros.filter(teatro =>
    teatro.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const indexOfLastTeatro = paginaActual * teatrosPorPagina;
  const indexOfFirstTeatro = indexOfLastTeatro - teatrosPorPagina;
  const teatrosActuales = teatrosFiltrados.slice(indexOfFirstTeatro, indexOfLastTeatro);
  const totalPaginas = Math.ceil(teatrosFiltrados.length / teatrosPorPagina);

  const irANuevaPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  return (
    <div className="teatros-container">
      <div className="header">
        <h2>Teatros Disponibles</h2>
        <input
          type="text"
          placeholder="Buscar teatros..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="buscador"
        />
      </div>
      <div className="teatros-grid">
        {teatrosActuales.length > 0 ? (
          teatrosActuales.map((teatro) => (
            <div key={teatro._id} className="teatro-card" onClick={() => abrirModal(teatro)}>
              <img src={teatro.imagen} alt={teatro.titulo} className="teatro-imagen" />
              <h3>{teatro.titulo}</h3>
              <p>{teatro.disponible ? 'Disponible' : 'No Disponible'}</p>
            </div>
          ))
        ) : (
          <p>No hay teatros disponibles.</p>
        )}
      </div>

      {/* Controles de paginación */}
      <div className="pagination">
        {Array.from({ length: totalPaginas }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => irANuevaPagina(index + 1)}
            className={`pagination-button ${paginaActual === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {teatroSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={cerrarModal}>&times;</span>
            <div className="modal-inner">
              <img src={teatroSeleccionado.imagen} alt={teatroSeleccionado.titulo} className="modal-imagen" />
              <div className="modal-info">
                <h2>{teatroSeleccionado.titulo}</h2>
                <p>{teatroSeleccionado.descripcion}</p>
                <p><strong>Capacidad:</strong> {teatroSeleccionado.capacidad}</p>
                <p><strong>Teléfono:</strong> {teatroSeleccionado.telefono}</p>
                <p><strong>Estado:</strong> {teatroSeleccionado.disponible ? 'Disponible' : 'No Disponible'}</p>
                {teatroSeleccionado.disponible && (
                  <button className="reservar-btn" onClick={handleReservar}>
                    Reservar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Teatros;
