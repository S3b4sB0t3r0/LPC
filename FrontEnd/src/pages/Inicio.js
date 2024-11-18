import React from 'react';
import { useNavigate } from 'react-router-dom';
import Carrusel from '../components/Carrusel'; // Asegúrate de que la ruta sea correcta
import '../styles/Inicio.css';

function Inicio() {
  const navigate = useNavigate();

  const info = [
    {
      title: 'Testimonios',
      description: 'Nuestros clientes comparten sus experiencias positivas con nuestros servicios, reflejando la unión de nuestro equipo.'
    },
    {
      title: 'Nuestro Equipo',
      description: 'Somos un equipo unido, profesional y apasionado, comprometido a ofrecer la mejor atención a cada cliente.'
    },
    {
      title: 'Nuestros Valores',
      description: 'La unión, el compromiso y la excelencia son los pilares que nos definen como equipo.'
    }    
  ];

  const testimonios = [
    {
      text: "Gracias a la gestión logística, logramos reducir nuestros costos y mejorar la satisfacción del cliente. - Juan P."
    },
    {
      text: "El equipo fue extremadamente profesional y eficiente, superando nuestras expectativas. - María R."
    },
    {
      text: "Su atención al detalle hizo que nuestro evento fuera un gran éxito. ¡Altamente recomendados! - Carlos L."
    },
    {
      text: "Estamos muy contentos con los resultados obtenidos. Sin duda volveremos a trabajar con ellos. - Ana M."
    },
    {
      text: "La planificación y ejecución fueron impecables. Un servicio de primera. - Luis T."
    },
    {
      text: "La comunicación fue excelente en todo momento, y el resultado final superó nuestras expectativas. ¡No podríamos estar más satisfechos! - Sofía G."
    }    
  ];

  const teatros = [
    {
      img: 'https://bogotateatralycircense.gov.co/sites/default/files/styles/900_x_515/public/img_salas/Teatro%20Libre%20Chapinero%20-%20Foto%20%40Sr.Mao%20-%2016%20copia.jpg?itok=3VMwVZ6M',
      title: 'Teatro Libre',
      description: 'El Teatro Libre de Bogotá, fundado en 1973, es un referente del teatro contemporáneo en Colombia, destacándose por su programación diversa y su apoyo a nuevos talentos.',
      link: '/teatros'
    },
    {
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTniPVCII8u0mWWTPGj0VNJjhey772QdPvGlQ&s',
      title: 'Teatro Colon',
      description: 'El Teatro Colón de Bogotá, inaugurado en 1892, es un ícono cultural conocido por su belleza y excelente acústica. Alberga ópera, ballet y conciertos, siendo fundamental en la escena artística de Colombia.',
      link: '/teatros'
    },
    {
      img: 'https://cloudfront-us-east-1.images.arcpublishing.com/semana/3LEOGANI4BAAVEYGOZYOFJRXQA.jpg',
      title: 'Teatro Delia',
      description: 'El Teatro Delia de Bogotá es un espacio cultural que promueve el teatro y la danza, destacando talentos emergentes y producciones locales.',
      link: '/teatros'
    }
  ];

  const eventos = [
    {
      img: 'https://s3.us-east-1.amazonaws.com/pub.comar.p51-s3.secutix.com/images/catalog/product/large/5777d69c-3dbd-468a-bcc5-cab1c2d8b115.png',
      title: 'Paisajes y pregones',
      description: 'Descubre un mundo de emociones.',
      link: '/eventos'
    },
    {
      img: 'https://s3.us-east-1.amazonaws.com/pub.comar.p51-s3.secutix.com/images/catalog/product/large/2f64b204-cc26-47ec-ab18-8a11fbdd768d.png',
      title: 'MEDO/ANGST',
      description: 'El miedo nos gobierna. Infundir y avivarlo ha sido una herramienta del poder y un elemento central dentro de las nuevas tendencias políticas reaccionarias y extremistas que ganan terreno en varios países del mundo.',
      link: '/eventos'
    },
    {
      img: 'https://tuboleta.com/imagenes/667090835f1c4.webp',
      title: 'PINK FLOYD TRIBUTO FILARMÓNICO',
      description: 'Este evento reunirá a más de 40 músicos en escena que interpretarán las legendarias canciones de este álbum que ha dejado huella en la historia del arte, la música y la cultura popular.',
      link: '/eventos'
    }
  ];

  const clientes = [
    {
      img: 'https://yt3.googleusercontent.com/ytc/AIdro_nnBEP7C-UU_pDw1BBZNdVRtNeYpd4ogcSpod8JNKt3J6U=s900-c-k-c0x00ffffff-no-rj',
      alt: 'Cliente 1'
    },
    {
      img: 'https://d5xydlzdo08s0.cloudfront.net/media/celebrities/14683/img_colon_300x300px__L.png',
      alt: 'Cliente 2'
    },
    {
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBnihZMpYwKrJpjLF0llDdHbaHvsFWwRBVcg&s',
      alt: 'Cliente 3'
    },
    {
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz3TDjsNbEjYggYRuO-EeM4GhQrxwk5oBuMA&s',
      alt: 'Cliente 4'
    },
    {
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSi5bXa2nLIKJGJwiEnLFoDzZINwWOkoGaxCA&s',
      alt: 'Cliente 5'
    },
    {
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZT_OXqhOEKJlm1DS_dUPFL4vpw0xTK-Z0rQ&s',
      alt: 'Cliente 6'
    },
    {
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvpYn1dRb8SqAegJ_xzSqHT2ns56h4fWI6fw&s',
      alt: 'Cliente 7'
    },
    {
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRawz0QclAaCgkoS-KxkT0vYP0xUvUM1I0R7Q&s',
      alt: 'Cliente 8'
    }
  ];

  const handleClick = (link) => {
    navigate(link);
  };

  return (
    <div className="inicio">
      <Carrusel /> {/* Carrusel de imágenes arriba */}
      <h2 className="section-title">Nosotros</h2>
      <div className="bolitas-container">
        {info.map((item, index) => (
          <div key={index} className="bolita">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>

      <h2 className="section-title">Testimonios</h2>
      <div className="bolitas-container">
        {testimonios.map((testimonio, index) => (
          <div key={index} className="bolita">
            <p>{testimonio.text}</p>
          </div>
        ))}
      </div>

      <h2 className="section-title">Teatros</h2>
      <div className="bolitas-container">
        {teatros.map((teatro, index) => (
          <div key={index} className="bolita" onClick={() => handleClick(teatro.link)}>
            <img src={teatro.img} alt={teatro.title} />
            <h3>{teatro.title}</h3>
            <p>{teatro.description}</p>
          </div>
        ))}
      </div>

      <h2 className="section-title">Eventos</h2>
      <div className="bolitas-container">
        {eventos.map((evento, index) => (
          <div key={index} className="bolita" onClick={() => handleClick(evento.link)}>
            <img src={evento.img} alt={evento.title} />
            <h3>{evento.title}</h3>
            <p>{evento.description}</p>
          </div>
        ))}
      </div>

      <h2 className="section-title">Clientes</h2>
      <div className="clientes-container">
        {clientes.map((cliente, index) => (
          <div key={index} className="cliente" id={`cliente-${index}`}>
            <img src={cliente.img} alt={cliente.alt} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Inicio;
