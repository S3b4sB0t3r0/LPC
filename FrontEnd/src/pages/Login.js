import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import logo from '../image/logo/9.png'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validación básica
    if (!email || !password) {
      setMessage('Por favor completa todos los campos');
      setMessageType('warning');
      return;
    }
  
    try {
      const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';
      console.log("API URL:", API_URL);
  
      // Realizar la solicitud al backend para login
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, contraseña: password }),
      });
  
      // Verificar si la respuesta es válida
      if (!response.ok) {
        const result = await response.json();
        setMessage(result.message || 'Correo o contraseña incorrectos');
        setMessageType('error');
        return;
      }
  
      const result = await response.json();
  
      // Guarda el token y los datos del usuario en localStorage
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify({ nombre: result.nombre, correo: email }));
  
      setMessage('Inicio de sesión exitoso. Redirigiendo...');
      setMessageType('success');
  
      // Redirigir dependiendo del rol del usuario
      setTimeout(() => {
        setMessage('');
        if (result.role === 'admin') {
          navigate('/admin'); // Redirige al admin si el rol es admin
        } else {
          navigate('/'); // Redirige al usuario normal
        }
      }, 2000);
  
    } catch (error) {
      console.error('Error en la solicitud:', error);
      setMessage('Hubo un error al conectar con el servidor');
      setMessageType('error');
    }
  
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
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
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Correo electrónico*"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Contraseña</label>
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            id="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>

        <br />
        <button type="submit">INICIAR SESIÓN</button>
      </form>

      {message && (
        <div className={`notification ${messageType}`} data-id={`login.${messageType}`}>
          {message}
        </div>
      )}
      <small>¿Olvidaste tu Contraseña? <a href="/restablecer">Ingresa Aquí</a></small>
    </div>
  );
}

export default Login;
