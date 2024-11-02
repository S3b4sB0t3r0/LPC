import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedAdmin = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  // Verificar si el usuario está autenticado y si su correo es el correcto
  if (!user || user.correo !== 'Sebas@GLC.com') {
    return <Navigate to="/" />; // Redirige a la página de inicio si no tiene acceso
  }

  return children; // Renderiza los hijos si el acceso es permitido
};

export default ProtectedAdmin;
