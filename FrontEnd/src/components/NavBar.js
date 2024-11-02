// src/components/NavBar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/NavBar.css';
import logo from '../image/logo/10.png';

function NavBar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail'); // Suponiendo que guardas el email en localStorage

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Eliminar el token
    localStorage.removeItem('userEmail'); // Eliminar el email
    navigate('/login'); // Redirigir a la página de login
  };

  const handleLogin = () => {
    // Aquí puedes manejar el inicio de sesión y guardar el token y email
    // Por ejemplo, después de la autenticación:
    // localStorage.setItem('token', 'tu_token_aqui');
    // localStorage.setItem('userEmail', 'usuario@example.com');
    navigate('/'); // Redirigir a la página principal
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>

      <ul className="nav-links">
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/mision">Misión y Visión</Link></li>
        <li><Link to="/servicios">Servicios</Link></li>
        <li><Link to="/teatros">Teatros</Link></li>
        <li><Link to="/eventos">Eventos</Link></li>
        <li><Link to="/contacto">Contáctanos</Link></li>
      </ul>

      <div className="user-dropdown">
        <div className="user-icon" onClick={toggleDropdown}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="4" fill="#fff" />
            <path d="M12 14c-4.418 0-8 2.015-8 4.5V21h16v-2.5c0-2.485-3.582-4.5-8-4.5z" fill="#fff"/>
          </svg>
        </div>
        {dropdownOpen && (
          <div className="dropdown-menu">
            {token ? (
              <>
                <div className="user-email">{userEmail}</div>
                <Link to="/reservas">Reservas</Link>
                <Link to="/cuenta">Cuenta</Link>
                <button onClick={handleLogout}>Cerrar Sesión</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={handleLogin}>Iniciar sesión</Link>
                <Link to="/register">Registrarse</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
