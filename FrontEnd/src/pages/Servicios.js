import React from 'react';
import '../styles/Servicios.css';
import servicioImage1 from '../image/Empresa/1.png'; // Asegúrate de que esta ruta sea correcta
import servicioImage2 from '../image/Empresa/2.png'; // Asegúrate de que esta ruta sea correcta
import servicioImage3 from '../image/Empresa/3.png'; // Asegúrate de que esta ruta sea correcta
import servicioImage4 from '../image/Empresa/4.png'; // Asegúrate de que esta ruta sea correcta
import servicioImage5 from '../image/Empresa/5.png'; // Asegúrate de que esta ruta sea correcta

function Servicios() {
  return (
    <div className="servicios-container">
      <h1 className="servicios-title">Nuestros Servicios</h1>
      
      {/* Sección de servicios */}
      <div className="servicios-item">
        <img src={servicioImage1} alt="Alquiler de Teatros" className="servicios-imagen" />
        <div className="servicios-texto">
          <h2 className="servicios-subtitle">Alquiler de Teatros</h2>
          <p>Facilitamos la reserva de espacios en teatros para todo tipo de eventos. Nos encargamos de la gestión integral de las salas, asegurando que cada detalle esté perfectamente cuidado para que tu evento sea un éxito.</p>
        </div>
      </div>
      <div className="servicios-item">
        <div className="servicios-texto">
          <h2 className="servicios-subtitle">Eventos Personalizados</h2>
          <p>Diseñamos experiencias únicas adaptadas a tus necesidades. Desde reuniones corporativas hasta espectáculos artísticos, nos aseguramos de que cada evento sea memorable y cumpla con tus expectativas.</p>
        </div>
        <img src={servicioImage2} alt="Eventos Personalizados" className="servicios-imagen" />
      </div>
      <div className="servicios-item">
        <img src={servicioImage3} alt="Conexión Directa a Boleterías" className="servicios-imagen" />
        <div className="servicios-texto">
          <h2 className="servicios-subtitle">Conexión a Boleterías</h2>
          <p>Ofrecemos enlaces directos a la boletería de los eventos más destacados, incluso aquellos que no están administrados por nosotros. Así, podrás acceder fácilmente a las entradas y disfrutar de la mejor programación cultural.</p>
        </div>
      </div>

      {/* Apartado de Logística */}
      <div className="logistica-container">
        <h1 className="logistica-title">Logística Eficiente</h1>
        <div className="logistica-items">
          <div className="logistica-item">
            <img src={servicioImage4} alt="Planificación de Eventos" className="logistica-imagen" />
            <p>Nuestra experiencia en la logística de eventos asegura una planificación fluida y sin contratiempos. Desde la coordinación del espacio hasta la gestión de proveedores, estamos aquí para facilitar tu experiencia.</p>
          </div>
          <div className="logistica-item">
            <img src={servicioImage5} alt="Convenios con Teatros" className="logistica-imagen" />
            <p>Contamos con convenios con una variedad de teatros, lo que nos permite ofrecerte múltiples opciones para tu evento. Cada teatro está cuidadosamente seleccionado para garantizar la mejor calidad y servicio.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Servicios;
