import React, { useState, useEffect } from 'react';
import '../styles/Carrusel.css';
import Image1 from '../image/Empresa/1.png'; 
import Image2 from '../image/Empresa/2.png'; 
import Image3 from '../image/Empresa/3.png'; 
import Image4 from '../image/Empresa/4.png'; 
import Image5 from '../image/Empresa/5.png'; 
import Image8 from '../image/Empresa/8.png'; 
import Image9 from '../image/Empresa/9.png'; 
import Image10 from '../image/Empresa/10.png'; 
import Image11 from '../image/Empresa/11.png'; 
import Image12 from '../image/Empresa/12.png'; 

const Carrusel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    Image1, 
    Image2, 
    Image3, 
    Image4,
    Image5,
    Image8,
    Image9,
    Image10,
    Image11,
    Image12
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // Usar useEffect para el intervalo
  useEffect(() => {
    const intervalId = setInterval(nextSlide, 5000); // Cambia la imagen cada 5 segundos

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="carrusel-container">
      <button className="carrusel-button carrusel-prev" onClick={prevSlide}>❮</button>
      <img src={images[currentIndex]} alt={`Imagen ${currentIndex + 1}`} className="carrusel-img" />
      <button className="carrusel-button carrusel-next" onClick={nextSlide}>❯</button>
    </div>
  );
};

export default Carrusel;
