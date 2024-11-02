import React, { useState } from 'react';
import '../styles/Restablecer.css';
import logo from '../image/logo/9.png'; // Asegúrate de que esta ruta sea correcta

function Restablecer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:4000/restablecer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Se ha enviado un enlace para restablecer tu contraseña.');
        setMessageType('success');
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Error al enviar el enlace. Intenta nuevamente.');
        setMessageType('error');
      }
    } catch (err) {
      setMessage('Error al enviar el enlace. Intenta nuevamente.');
      setMessageType('error');
    } finally {
      setLoading(false);
      // Limpia el mensaje después de 5 segundos
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 1000);
    }
  };

  return (
    <div className="restablecer-container">
      <img src={logo} alt="Logo" className="restablecer-logo" />
      <h1 className="restablecer-titulo">Restablecer contraseña</h1>
      <p className="restablecer-instrucciones">
        Ingresa tu dirección de correo electrónico y te enviaremos un enlace para restablecer la contraseña.
      </p>
      <form className="restablecer-formulario" onSubmit={handleSubmit}>
        <label className="restablecer-label" htmlFor="email">Correo electrónico</label>
        <input 
          type="email" 
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Dirección de correo electrónico" 
          className="restablecer-input"
          required
        />
        <button type="submit" className="restablecer-boton" disabled={loading}>
          {loading ? 'Enviando...' : 'ENVIAR ENLACE PARA RESTABLECER'}
        </button>
      </form>

      {message && (
        <div className={`notification ${messageType}`} data-id={`restablecer.${messageType}`}>
          {message}
        </div>
      )}

      <p className="restablecer-opcion">
        ¿No necesitas restablecer tu contraseña? <a href="/login">Inicia sesión.</a>
      </p>
    </div>
  );
}

export default Restablecer;
