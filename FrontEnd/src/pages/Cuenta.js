import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Cuenta.css';

function Cuenta() {
  const [user, setUser] = useState(null);
  const [reservas, setReservas] = useState([]);
  const navigate = useNavigate();

  // useEffect para cargar el usuario desde localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate('/login'); // Redirige a login si no hay usuario almacenado
    }
  }, [navigate]);

  // useEffect para cargar las reservas cuando el usuario está definido
  useEffect(() => {
    if (user) {
      fetchReservas();
    }
  }, [user]); 

  const fetchReservas = async () => {
    try {
      const token = localStorage.getItem('token'); // Asumiendo que el token se guarda en localStorage
      const response = await fetch('http://localhost:4000/reservas', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener las reservas');
      }

      const data = await response.json();
      console.log('Datos de reservas:', data); // Verifica la estructura de los datos
      console.log('Correo del usuario actual:', user?.correo); // Verifica el correo actual

      // Filtra las reservas del usuario
      const reservasFiltradas = data.filter(
        reserva => reserva.email?.toLowerCase() === user.correo?.toLowerCase()
      );
      setReservas(reservasFiltradas);
    } catch (error) {
      console.error('Error fetching reservas:', error);
    }
  };

  const handleReservacionesClick = () => {
    navigate('/reservas');
  };

  if (!user) {
    return <div className="cuenta-error">Cargando información del usuario...</div>;
  }

  return (
    <div className="cuenta-page" id="cuenta-page-sebastian">
      <aside className="cuenta-sidebar" id="cuenta-sidebar-sebastian">
        <ul className="cuenta-sidebar-list" id="cuenta-sidebar-list-sebastian">
          <li onClick={handleReservacionesClick}>Reservaciones</li>
          <li className="active">Cuenta</li>
        </ul>
      </aside>

      <main className="cuenta-main-content" id="cuenta-main-content-sebastian">
        <h1>Hola {user.nombre}</h1>
        <div className="cuenta-profile-view" id="cuenta-profile-view-sebastian">
          <p><strong>Correo electrónico:</strong> {user.correo}</p>
        </div>
        
        <h2>Mis Reservas</h2>
        {reservas.length > 0 ? (
          <table className="reservas-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Teatro</th>
                <th>Tipo Evento</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map(reserva => (
                <tr key={reserva._id}> {/* Cambia 'id' por '_id' si es el campo de MongoDB */}
                  <td>{reserva.nombre}</td>
                  <td>{reserva.fecha}</td>
                  <td>{reserva.hora}</td>
                  <td>{reserva.teatro}</td>
                  <td>{reserva.tipoEvento}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay reservas registradas para el correo: {user.correo}</p>
        )}
      </main>
    </div>
  );
}

export default Cuenta;
