import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/RestablecerContraseña.css';
import logo from '../image/logo/9.png'; // Asegúrate de que esta ruta sea correcta

function RestablecerContraseña() {
  const { token } = useParams();
  const [nuevaContraseña, setNuevaContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mensajeTipo, setMensajeTipo] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verificarToken = async () => {
      try {
        // Usa la variable de entorno para la URL del backend
        const API_URL = process.env.REACT_APP_BACKEND_URL;

        const response = await fetch(`${API_URL}/restablecer/${token}`);
        if (!response.ok) throw new Error('Token inválido o expirado');
        setMensaje('Token válido. Puedes establecer una nueva contraseña.');
        setMensajeTipo('success');
      } catch (error) {
        setMensaje(error.message);
        setMensajeTipo('error');
      }
    };

    verificarToken();
  }, [token]);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    if (nuevaContraseña !== confirmarContraseña) {
      setMensaje('Las contraseñas no coinciden.');
      setMensajeTipo('error');
      mostrarMensaje();
      return;
    }

    try {
      // Usa la variable de entorno para la URL del backend
      const API_URL = process.env.REACT_APP_BACKEND_URL;

      const response = await fetch(`${API_URL}/restablecer/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nuevaContraseña }),
      });

      if (!response.ok) throw new Error('Error al restablecer la contraseña.');
      setMensaje('Contraseña restablecida con éxito.');
      setMensajeTipo('success');

      // Redirigir a la página de login
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      setMensaje(error.message);
      setMensajeTipo('error');
    }

    mostrarMensaje();
  };

  const mostrarMensaje = () => {
    setTimeout(() => {
      setMensaje('');
      setMensajeTipo('');
    }, 5000); // Limpia el mensaje después de 5 segundos
  };

  return (
    <div className="restablecer-contraseña-container">
      <img src={logo} alt="Logo" className="restablecer-logo" />
      <h1 className="restablecer-contraseña-titulo">Restablecer Contraseña</h1>
      {mensaje && (
        <div className={`notification ${mensajeTipo}`} data-id={`restablecerContraseña.${mensajeTipo}`}>
          {mensaje}
        </div>
      )}
      <form className="restablecer-contraseña-formulario" onSubmit={manejarSubmit}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={nuevaContraseña}
          onChange={(e) => setNuevaContraseña(e.target.value)}
          required
          className="restablecer-contraseña-input"
        />
        <input
          type="password"
          placeholder="Confirmar nueva contraseña"
          value={confirmarContraseña}
          onChange={(e) => setConfirmarContraseña(e.target.value)}
          required
          className="restablecer-contraseña-input"
        />
        <button type="submit" className="restablecer-contraseña-boton">Restablecer Contraseña</button>
      </form>
    </div>
  );
}

export default RestablecerContraseña;
