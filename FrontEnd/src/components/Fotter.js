import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <h2>Gestión Logística</h2>
                <ul className="footer-links">
                    <li><a href="/mision">Sobre Nosotros</a></li>
                    <li><a href="/servicios">Servicios</a></li>
                    <li><a href="/contacto">Contacto</a></li>
                    <li><a href="/contacto">PQRS</a></li>
                </ul>
                <p>© 2024 Gestión Logística. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;
