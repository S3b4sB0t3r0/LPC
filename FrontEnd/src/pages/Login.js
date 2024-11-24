import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import logo from '../image/logo/9.png'; // Asegúrate de que esta ruta sea correcta

function Login() {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      // Usa la variable de entorno para la URL de la API
      const API_URL = process.env.REACT_APP_API_URL;

      // Validar si la URL de la API está configurada
      if (!API_URL) {
        throw new Error("La variable de entorno REACT_APP_API_URL no está configurada correctamente.");
      }

      // Enviar la solicitud de login
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: data.email,
          contraseña: data.password,
        }),
      });

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const result = await response.json(); // Si no es ok, obtener el mensaje de error
        setErrorMessage(result.message || 'Correo o contraseña incorrectos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
        return; // Detener el flujo si hay error
      }

      const result = await response.json(); // Si la respuesta es ok, obtener el resultado
      const token = result.token; // Guarda el token
      localStorage.setItem('token', token);

      // Guarda la información del usuario en localStorage
      localStorage.setItem('user', JSON.stringify({
        nombre: result.nombre,
        correo: data.email,
      }));

      setSuccessMessage('Inicio de sesión exitoso. Redirigiendo...');
      setTimeout(() => {
        setSuccessMessage('');
        // Redirige al administrador si es el usuario especial
        if (data.email === 'Sebas@GLC.com') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 3000);
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
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            id="password"
            placeholder="Contraseña"
            required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>

        <br />
        <button type="submit">INICIAR SESIÓN</button>
      </form>

      {errorMessage && (
        <div className="notification error" data-id="login.error" aria-live="assertive">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="notification success" data-id="login.success" aria-live="polite">
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
