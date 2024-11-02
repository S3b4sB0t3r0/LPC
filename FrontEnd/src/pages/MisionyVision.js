import React from 'react';
import '../styles/MisionyVision.css';
import logo from '../image/Empresa/1.png'; // Asegúrate de que esta ruta sea correcta
import visionImage from '../image/Empresa/8.png'; // Reemplaza con la ruta de tu imagen de visión

function MisionyVision() {
  return (
    <div className="mision-vision-container">
      <div className="mision-vision-section">
        <h2>Misión</h2>
        <img src={logo} alt="Misión" className="mision-vision-image" />
        <p>
          • Ofrecer a nuestros clientes un servicio personalizado y adaptado a sus necesidades, poniendo a su disposición nuestra experiencia, conocimiento, propuestas integrales y profesionalismo, para cumplir sus objetivos.
        </p>
      </div>

      <div className="mision-vision-section">
        <h2>Visión</h2>
        <img src={visionImage} alt="Visión" className="mision-vision-image" />
        <p>
          • Mantener nuestro posicionamiento como empresa líder en el desarrollo y producción de eventos, con propuestas integrales desde el desarrollo de conceptos, hasta la oferta 360 que incluye seguridad, logística, brigadistas, montaje, cerramientos, técnica, iluminación, palcos, pisos, graderías, entre otros, a través de la mejora constante de los servicios que ofrecemos.
        </p>
      </div>
    </div>
  );
}

export default MisionyVision;
