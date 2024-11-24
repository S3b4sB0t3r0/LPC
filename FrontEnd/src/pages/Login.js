import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import logo from '../image/logo/9.png'; // Asegúrate de que esta ruta sea correcta

function Login() {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      // Usa la variable de entorno para la URL de la API
      const API_URL = process.env.REACT_APP_API_URL;

      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: data.email,
          contraseña: data.password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        const token = result.token; // Guarda el token
        localStorage.setItem('token', token);

        localStorage.setItem('user', JSON.stringify({
          nombre: result.nombre,
          correo: data.email,
        }));

        setSuccessMessage('Inicio de sesión exitoso. Redirigiendo...');
        setTimeout(() => {
          setSuccessMessage('');
          if (data.email === 'Sebas@GLC.com') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 3000);
      } else {
        setErrorMessage(result.message || 'Correo o contraseña incorrectos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setErrorMessage('Hubo un error al conectar con el servidor');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Logo" className="login-logo" />
      <header className="login-header">
        <h2>Iniciar Sesión</h2>
        <p>Accede a tu cuenta para continuar</p>
      </header>
      
      <form id="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Correo electrónico</label>
        <input type="email" name="email" id="email" placeholder="Correo electrónico*" required />
        
        <label htmlFor="password">Contraseña</label>
        <input type="password" name="password" id="password" placeholder="Contraseña" required />
        
        <br />
        <button type="submit">INICIAR SESIÓN</button>
      </form>

      {errorMessage && (
        <div
          className="notification error"
          data-id="login.error"
          aria-live="assertive"
        >
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div
          className="notification success"
          data-id="login.success"
          aria-live="polite"
        >
          {successMessage}
        </div>
      )}
      <small>
        ¿Olvidaste tu Contraseña? <a href="/restablecer">Ingresa Aquí</a>
      </small>
    </div>
  );
}

export default Login;
