import React, { useState, useEffect } from 'react';
import '../styles/Teatros.css';

function Teatros() {
  const [teatros, setTeatros] = useState([]);
  const [teatroSeleccionado, setTeatroSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const teatrosPorPagina = 6;
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);  // Estado para verificar si el usuario está autenticado
  const [error, setError] = useState(''); // Estado para manejar errores de carga

  useEffect(() => {
    // Cargar teatros
    const cargarTeatros = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/teatros`);
        if (!response.ok) {
          throw new Error('Error al obtener los teatros');
        }
    
        // Verificar que la respuesta sea JSON antes de procesarla
        const data = await response.json();
        setTeatros(data);
      } catch (error) {
        console.error('Error al cargar los teatros:', error);
        setError('Hubo un error al cargar los teatros.');
      }
    };
    

    cargarTeatros();

    // Verificar si el usuario está autenticado (simulación con un estado)
    const verificarAutenticacion = () => {
      const usuario = localStorage.getItem('usuario'); // Aquí asumimos que si hay un "usuario" en localStorage, el usuario está autenticado
      setUsuarioAutenticado(!!usuario);  // Si el valor es nulo o vacío, el usuario no está autenticado
    };

    verificarAutenticacion();
  }, []);

  const abrirModal = (teatro) => {
    setTeatroSeleccionado(teatro);
  };

  const cerrarModal = () => {
    setTeatroSeleccionado(null);
  };

  // Filtrar teatros por búsqueda
  const teatrosFiltrados = teatros.filter(teatro =>
    teatro.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Lógica de paginación
  const indexOfLastTeatro = paginaActual * teatrosPorPagina;
  const indexOfFirstTeatro = indexOfLastTeatro - teatrosPorPagina;
  const teatrosActuales = teatrosFiltrados.slice(indexOfFirstTeatro, indexOfLastTeatro);
  const totalPaginas = Math.ceil(teatrosFiltrados.length / teatrosPorPagina);

  const irANuevaPagina = (numeroPagina) => {
    if (numeroPagina >= 1 && numeroPagina <= totalPaginas) {
      setPaginaActual(numeroPagina);
    }
  };

  const handleReservar = () => {
    if (teatroSeleccionado) {
      alert(`Reserva realizada para el teatro: ${teatroSeleccionado.titulo}`);
    }
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

      {error && <div className="error-message">{error}</div>}

      <div className="teatros-grid">
        {teatrosActuales.length > 0 ? (
          teatrosActuales.map((teatro) => (
            <div key={teatro._id} className="teatro-card" onClick={() => abrirModal(teatro)}>
              <img src={teatro.imagen} alt={teatro.titulo} className="teatro-imagen" />
              <h3>{teatro.titulo}</h3>
            </div>
          ))
        ) : (
          <p>No hay teatros disponibles.</p>
        )}
      </div>

      {/* Controles de paginación */}
      <div className="pagination">
        {totalPaginas > 1 && Array.from({ length: totalPaginas }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => irANuevaPagina(index + 1)}
            className={`pagination-button ${paginaActual === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Botón de reserva, solo si el usuario está autenticado */}
      {usuarioAutenticado && teatroSeleccionado && (
        <div className="reservar-btn-container">
          <button
            id="teatros.button.reserva"
            className="reservar-btn"
            onClick={handleReservar}
          >
            Reservar
          </button>
        </div>
      )}

      {/* Modal */}
      {teatroSeleccionado && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-button" onClick={cerrarModal}>&times;</span>
            <div className="modal-body">
              <div className="modal-info">
                <h2>{teatroSeleccionado.titulo}</h2>
                <p><strong>Descripción:</strong> {teatroSeleccionado.descripcion}</p>
                <p><strong>Capacidad:</strong> {teatroSeleccionado.capacidad}</p>
                <p><strong>Teléfono:</strong> {teatroSeleccionado.telefono}</p>
                <div>
                  <strong>Ubicación:</strong>
                  <div dangerouslySetInnerHTML={{ __html: teatroSeleccionado.mapa }} />
                </div>
              </div>
              <img src={teatroSeleccionado.imagen} alt={teatroSeleccionado.titulo} className="modal-imagen" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Teatros;
