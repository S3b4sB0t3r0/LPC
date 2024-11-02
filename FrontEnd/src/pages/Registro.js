import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Registro.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import logo from '../image/logo/9.png'; // Asegúrate de que esta ruta sea correcta


function Registro() {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (data.password !== data['confirm-password']) {
      setMessage('Las contraseñas no coinciden');
      setMessageType('warning');
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 1000); // 1 segundo
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/Usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: data.name,
          correo: data.email,
          contraseña: data.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
        setMessageType('success');
        setTimeout(() => {
          navigate('/login');
        }, 1000); // Redirige después de 1 segundo
      } else {
        setMessage(result.message || 'Hubo un error en el registro');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Hubo un error al conectar con el servidor');
      setMessageType('error');
    }

    // Limpia el mensaje después de 1 segundo
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 1000);
  };

  return (
    <div className="registro-container" >
      <header className="registro-header">
        <img src={logo} alt="Logo de Registro" className="register-logo" />
        <h2>Regístrate</h2>
        <p>Crea una cuenta para acceder a nuestros servicios</p>
      </header>

      <form id="registro-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Nombre</label>
        <input type="text" name="name" id="register-name" placeholder="Nombre completo" required />

        <label htmlFor="email">Correo electrónico</label>
        <input type="email" name="email" id="register-email" placeholder="Correo electrónico*" required />

        <label htmlFor="password">Contraseña</label>
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            id="register-password"
            placeholder="Contraseña"
            required
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>

        <label htmlFor="confirm-password">Confirma tu contraseña</label>
        <div className="password-container">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirm-password"
            id="register-confirm-password"
            placeholder="Confirma tu contraseña"
            required
          />
          <FontAwesomeIcon
            icon={showConfirmPassword ? faEyeSlash : faEye}
            className="toggle-password"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        </div>

        <br />
        <button type="submit">REGISTRARME</button>
      </form>

      {message && (
        <div className={`notification ${messageType}`} data-id={`registro.${messageType}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default Registro;
