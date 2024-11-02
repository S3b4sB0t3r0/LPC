import React, { useState, useEffect } from 'react';
import '../styles/Teatros.css';

function Teatros() {
  const [teatros, setTeatros] = useState([]);
  const [teatroSeleccionado, setTeatroSeleccionado] = useState(null);

  useEffect(() => {
    const cargarTeatros = async () => {
      try {
        const response = await fetch('http://localhost:4000/teatros'); // Cambiado a /teatros
        if (!response.ok) {
          throw new Error('Error al obtener los teatros');
        }
        const data = await response.json();
        setTeatros(data);
      } catch (error) {
        console.error('Error al cargar los teatros:', error);
      }
    };

    cargarTeatros();
  }, []);

  const abrirModal = (teatro) => {
    setTeatroSeleccionado(teatro);
  };

  const cerrarModal = () => {
    setTeatroSeleccionado(null);
  };

  return (
    <div className="teatros-container">
      <h2>Teatros Disponibles</h2>
      <div className="teatros-grid">
        {teatros.map((teatro) => (
          <div key={teatro._id} className="teatro-card" onClick={() => abrirModal(teatro)}>
            <img src={teatro.imagen} alt={teatro.titulo} className="teatro-imagen" />
            <h3>{teatro.titulo}</h3>
          </div>
        ))}
      </div>

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
