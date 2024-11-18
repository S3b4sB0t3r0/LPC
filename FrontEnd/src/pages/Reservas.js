import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Reservas.css';

function Reservas() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const nombre = storedUser ? storedUser.nombre : '';
  const email = storedUser ? storedUser.correo : '';

  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [teatro, setTeatro] = useState('');
  const [tipoEvento, setTipoEvento] = useState('');
  const [otroEvento, setOtroEvento] = useState('');
  const [duracion, setDuracion] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = new Date();
    const fechaSeleccionada = new Date(`${fecha}T${hora}`);
    const diferenciaDias = (fechaSeleccionada - now) / (1000 * 60 * 60 * 24);

    // Validar fecha futura y con al menos 2 días de anticipación
    if (diferenciaDias < 2) {
      mostrarNotificacion('La reserva debe realizarse al menos con 2 días de anticipación.', 'error');
      return;
    }

    const reserva = {
      id: Date.now().toString(),
      nombre,
      email,
      fecha,
      hora,
      teatro,
      tipoEvento: tipoEvento === 'Otro' ? otroEvento : tipoEvento,
      duracion,
      imagenUrl,
      estado: null,
    };

    try {
      const response = await fetch('http://localhost:4000/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reserva),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la reserva');
      }

      const data = await response.json();
      mostrarNotificacion('Reserva realizada con éxito!', 'success');

      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Error al realizar la reserva:', error);
      mostrarNotificacion('Hubo un error al realizar la reserva. Intenta nuevamente.', 'error');
    }
  };

  const mostrarNotificacion = (mensaje, tipo) => {
    setMensaje(mensaje);
    setTipoMensaje(tipo);
    setTimeout(() => {
      setMensaje('');
      setTipoMensaje('');
    }, 5000);
  };


  return (
    <div className="reservas-page" id="reservas-page">
      <aside className="reservas-sidebar" id="reservas-sidebar">
        <ul className="reservas-sidebar-list" id="reservas-sidebar-list">
          <li className="reservas-menu-item" id="reservaciones-link" onClick={() => navigate('/reservas')}>
            Reservaciones
          </li>
          <li className="reservas-menu-item" id="cuenta-link" onClick={() => navigate('/cuenta')}>
            Cuenta
          </li>
        </ul>
      </aside>

      <main className="reservas-main-content" id="reservas-main-content">
        <h1 className="reservas-title" id="reservas-title">Reservar</h1>
        <div className="reservas-form-container" id="reservas-form-container">
          <form className="reservas-form" id="reservas-form" onSubmit={handleSubmit}>
            <div className="reservas-row">
              <div className="reservas-col">
                <label htmlFor="input-nombre" className="reservas-label">Nombre Completo</label>
                <input 
                  type="text" 
                  id="input-nombre" 
                  value={nombre} 
                  readOnly 
                  className="reservas-input" 
                  required 
                />
              </div>
              
              <div className="reservas-col">
                <label htmlFor="input-email" className="reservas-label">Correo Electrónico</label>
                <input 
                  type="email" 
                  id="input-email" 
                  value={email} 
                  readOnly 
                  className="reservas-input" 
                  required 
                />
              </div>
            </div>

            <div className="reservas-row">
              <div className="reservas-col">
                <label htmlFor="input-fecha" className="reservas-label">Fecha</label>
                <input 
                  type="date" 
                  id="input-fecha" 
                  value={fecha} 
                  onChange={(e) => setFecha(e.target.value)} 
                  className="reservas-input" 
                  required 
                />
              </div>
              
              <div className="reservas-col">
                <label htmlFor="input-hora" className="reservas-label">Hora</label>
                <input 
                  type="time" 
                  id="input-hora" 
                  value={hora} 
                  onChange={(e) => setHora(e.target.value)} 
                  className="reservas-input" 
                  required 
                />
              </div>

              <div className="reservas-col">
                <label htmlFor="input-duracion" className="reservas-label">Duración (Horas)</label>
                <input 
                  type="number" 
                  id="input-duracion" 
                  value={duracion} 
                  onChange={(e) => setDuracion(e.target.value)} 
                  className="reservas-input" 
                  required 
                  min="1"
                  max="8"
                />
              </div>
            </div>

            <div className="reservas-row">
              <div className="reservas-col">
                <label htmlFor="input-teatro" className="reservas-label">Teatro</label>
                <select 
                  id="input-teatro" 
                  value={teatro} 
                  onChange={(e) => setTeatro(e.target.value)} 
                  className="reservas-input" 
                  required
                >
                  <option value="">Selecciona un teatro</option>
                  <option value="Teatro Libre">Teatro Libre</option>
                  <option value="Teatro Colon">Teatro Colon</option>
                  <option value="Teatro Delia">Teatro Delia</option>
                  <option value="Teatro Nacional">Teatro Nacional</option>
                  <option value="Teatro Lozano">Teatro Lozano</option>
                  <option value="Teatro La Candelaria">Teatro La Candelaria</option>
                  <option value="Teatro Jorge Eliécer Gaitán">Teatro Jorge Eliécer Gaitán</option>
                  <option value="Teatro Cafam">Teatro Cafam</option>
                </select>
              </div>

              <div className="reservas-col">
                <label htmlFor="input-tipoEvento" className="reservas-label">Tipo de Evento</label>
                <select 
                  id="input-tipoEvento" 
                  value={tipoEvento} 
                  onChange={(e) => setTipoEvento(e.target.value)} 
                  className="reservas-input" 
                  required
                >
                  <option value="">Selecciona el tipo de evento</option>
                  <option value="Obra de teatro">Obra de teatro</option>
                  <option value="Obra Musical">Obra Musical</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            {tipoEvento === 'Otro' && (
              <div className="reservas-col">
                <label htmlFor="input-otroEvento" className="reservas-label">Especifica el Tipo de Evento</label>
                <input 
                  type="text" 
                  id="input-otroEvento" 
                  value={otroEvento} 
                  onChange={(e) => setOtroEvento(e.target.value)} 
                  className="reservas-input" 
                  required 
                />
              </div>
            )}

            <div className="reservas-col">
              <label htmlFor="input-imagenUrl" className="reservas-label">URL de la Imagen</label>
              <input 
                type="url" 
                id="input-imagenUrl" 
                value={imagenUrl} 
                onChange={(e) => setImagenUrl(e.target.value)} 
                className="reservas-input" 
                required 
              />
            </div>

            <button type="submit" className="reservas-submit-btn" id="reservas-submit-btn">Solicitud de Reservar</button>
          </form>
        </div>

        {mensaje && (
          <div className={`reservas.notificacion ${tipoMensaje}`} id="reservas-notification">
            {mensaje}
          </div>
        )}
      </main>
    </div>
  );
}

export default Reservas;
