import React, { useState } from 'react';
import '../styles/Contacto.css';
import logo from '../image/logo/9.png'; // Asegúrate de que esta ruta sea correcta

function Contacto() {
  const [error, setError] = useState('');
  const [notification, setNotification] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.target);
    const data = {
      nombre: formData.get('name'),
      email: formData.get('email'),
      mensaje: formData.get('message'),
    };

    if (!data.nombre || !data.email || !data.mensaje) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    // Usa la variable de entorno para la URL del backend
    const API_URL = process.env.REACT_APP_BACKEND_URL;

    fetch(`${API_URL}/contacto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then(err => {
            throw new Error(err.message || 'Error al enviar el mensaje');
          });
        }
      })
      .then(data => {
        setNotification(data.message);
        setTimeout(() => {
          setNotification(null);
          window.location.href = '/';
        }, 2000);
      })
      .catch(error => {
        console.error('Error:', error);
        setError(error.message);
        setTimeout(() => {
          setError('');
        }, 2000);
      });
  };

  return (
    <div className="contact-container">
      <img src={logo} alt="Logo de Contacto" className="contacto-logo" />
      <h2>Comunícate con nosotros</h2>
      <p>Estás interesado en que te apoyemos con tu evento, comunícate con nosotros.</p>

      {error && (
        <div className="notification error">
          {error}
        </div>
      )}

      {notification && (
        <div className="notification success">
          {notification}
        </div>
      )}

      <form id="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="contact-name">Nombre</label>
        <input type="text" name="name" id="contact-name" placeholder="Nombre" required />

        <label htmlFor="contact-email">Correo electrónico</label>
        <input type="email" name="email" id="contact-email" placeholder="Correo electrónico*" required />

        <label htmlFor="contact-message">Mensaje</label>
        <textarea name="message" id="contact-message" placeholder="Mensaje" required></textarea>

        <br />
        <button type="submit">ENVIAR</button>
      </form>
    </div>
  );
}

export default Contacto;
