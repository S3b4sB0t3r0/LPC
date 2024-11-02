// src/components/Layout.js
import React from 'react';
import NavBar from './NavBar';
import Footer from './Fotter'; // Asegúrate de que el nombre sea correcto

function Layout({ children }) {
  return (
    <div className="layout">
      <NavBar />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
