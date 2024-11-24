import React, { useState, useEffect } from 'react';
import '../styles/Eventos.css';

function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const eventosPorPagina = 6;

  // Usa la variable de entorno para la URL del backend
  const API_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const response = await fetch(`${API_URL}/eventos`);
        if (!response.ok) {
          throw new Error('Error al obtener los eventos');
        }
        const data = await response.json();
        // Asegúrate de que 'estado' es un booleano
        const eventosConDisponibilidad = data.map(evento => ({
          ...evento,
          disponible: evento.estado, // Asegúrate de que esto se alinee con tu esquema
        }));
        setEventos(eventosConDisponibilidad);
      } catch (error) {
        console.error('Error al cargar los eventos:', error);
      }
    };
    
    cargarEventos();
  }, [API_URL]);

  const abrirModal = (evento) => {
    setEventoSeleccionado(evento);
  };

  const cerrarModal = () => {
    setEventoSeleccionado(null);
  };

  const handleComprarBoleta = async () => {
    if (eventoSeleccionado) {
      try {
        // Actualizar el estado del evento a no disponible
        await fetch(`${API_URL}/api/eventos/${eventoSeleccionado._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ estado: false }), // Cambiar a no disponible
        });
        // Redirigir al sitio de compra de boletos
        window.location.href = 'https://tuboleta.com/';
      } catch (error) {
        console.error('Error al actualizar el estado del evento:', error);
      }
    }
  };

  const eventosFiltrados = eventos.filter(evento =>
    evento.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const indexOfLastEvento = paginaActual * eventosPorPagina;
  const indexOfFirstEvento = indexOfLastEvento - eventosPorPagina;
  const eventosActuales = eventosFiltrados.slice(indexOfFirstEvento, indexOfLastEvento);
  const totalPaginas = Math.ceil(eventosFiltrados.length / eventosPorPagina);

  const irANuevaPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  return (
    <div className="eventos-container">
      <div className="header">
        <h2>Próximos Eventos</h2>
        <input
          type="text"
          placeholder="Buscar eventos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="buscador"
        />
      </div>
      <div className="eventos-grid">
        {eventosActuales.length > 0 ? (
          eventosActuales.map((evento) => (
            <div key={evento._id} className="evento-card" onClick={() => abrirModal(evento)}>
              <img src={evento.imagen} alt={evento.nombre} className="evento-imagen" />
              <h3>{evento.nombre}</h3>
              <p>{new Date(evento.fecha).toLocaleDateString()} {evento.hora}</p>
              <p>{evento.disponible ? 'Disponible' : 'No Disponible'}</p>
            </div>
          ))
        ) : (
          <p>No hay eventos disponibles.</p>
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

      {eventoSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={cerrarModal}>&times;</span>
            <div className="modal-inner">
              <img src={eventoSeleccionado.imagen} alt={eventoSeleccionado.nombre} className="modal-imagen" />
              <div className="modal-info">
                <h2>{eventoSeleccionado.nombre}</h2>
                <p>{eventoSeleccionado.descripcion}</p>
                <p><strong>Fecha:</strong> {new Date(eventoSeleccionado.fecha).toLocaleDateString()}</p>
                <p><strong>Hora:</strong> {eventoSeleccionado.hora}</p>
                <p><strong>Estado:</strong> {eventoSeleccionado.disponible ? 'Disponible' : 'No Disponible'}</p>
                {eventoSeleccionado.disponible && (
                  <button className="comprar-boleta-btn" onClick={handleComprarBoleta}>
                    Comprar Boleta
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

export default Eventos;
