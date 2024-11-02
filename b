const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'logísticacolombianalpc@gmail.com',
    pass: 'jymp llhg bzbw jsbz', // Asegúrate de que la contraseña sea correcta
  },
});

const sendResetEmail = async (email, resetLink) => {
  const mailOptions = {
    from: 'logísticacolombianalpc@gmail.com',
    to: email,
    subject: 'Restablecimiento de Contraseña - Gestión logística Colombiana',
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <style>
              body {
                  font-family: 'Helvetica', sans-serif;
                  background-color: #f4f4f4;
                  padding: 0;
                  margin: 0;
              }
              .container {
                  max-width: 600px;
                  margin: auto;
                  background: white;
                  border: 1px solid #e1e1e1;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  overflow: hidden;
              }
              .header {
                  background: black;
                  color: gold;
                  padding: 20px;
                  text-align: center;
              }
              .content {
                  padding: 20px;
              }
              h1 {
                  margin: 0;
                  font-size: 24px;
              }
              p {
                  line-height: 1.6;
                  color: #333;
              }
              a {
                  display: inline-block;
                  margin-top: 20px;
                  padding: 12px 15px;
                  background: gold;
                  color: black;
                  text-decoration: none;
                  border-radius: 4px;
                  text-align: center;
                  font-weight: bold;
              }
              a:hover {
                  background: #e0c700; /* Un tono dorado más oscuro */
              }
              .footer {
                  text-align: center;
                  padding: 10px;
                  font-size: 12px;
                  color: #666;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Gestión logística Colombiana</h1>
              </div>
              <div class="content">
                  <h2>Estimado Usuario,</h2>
                  <p>Hemos recibido una solicitud para restablecer la contraseña de su cuenta en Gestión logística Colombiana.</p>
                  <p>Por favor, haga clic en el siguiente enlace para restablecer su contraseña:</p>
                  <a href="${resetLink}">Restablecer Contraseña</a>
                  <p>Si no solicitó este cambio, puede ignorar este correo. Su cuenta permanece segura.</p>
              </div>
              <div class="footer">
                  <p>© 2024 Gestión logística Colombiana. Todos los derechos reservados.</p>
                  <p>Estamos aquí para ayudarlo con la logística de sus eventos, grandes o pequeños.</p>
              </div>
          </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado a:', email);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error;
  }
};

const sendContactEmail = async (email) => {
  const mailOptions = {
    from: 'logísticacolombianalpc@gmail.com',
    to: email,
    subject: 'Confirmación de Mensaje - Gestión logística Colombiana',
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <style>
              body {
                  font-family: 'Helvetica', sans-serif;
                  background-color: #f4f4f4;
                  padding: 0;
                  margin: 0;
              }
              .container {
                  max-width: 600px;
                  margin: auto;
                  background: white;
                  border: 1px solid #e1e1e1;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  overflow: hidden;
              }
              .header {
                  background: black;
                  color: gold;
                  padding: 20px;
                  text-align: center;
              }
              .content {
                  padding: 20px;
              }
              h1 {
                  margin: 0;
                  font-size: 24px;
              }
              p {
                  line-height: 1.6;
                  color: #333;
              }
              .footer {
                  text-align: center;
                  padding: 10px;
                  font-size: 12px;
                  color: #666;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Gestión logística Colombiana</h1>
              </div>
              <div class="content">
                  <h2>Querido Usuario,</h2>
                  <p>Gracias por contactarnos. Hemos recibido su mensaje y nuestro equipo lo revisará pronto.</p>
                  <p>Si tiene alguna pregunta adicional, no dude en comunicarse con nosotros.</p>
                  <p>¡Estamos aquí para ayudarle!</p>
              </div>
              <div class="footer">
                  <p>© 2024 Gestión logística Colombiana. Todos los derechos reservados.</p>
                  <p>Estamos aquí para ayudarlo con la logística de sus eventos, grandes o pequeños.</p>
              </div>
          </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado a:', email);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error;
  }
};

 

// Reservas

const sendReservationEmail = async (email) => {
    const mailOptions = {
      from: 'logísticacolombianalpc@gmail.com',
      to: email,
      subject: 'Confirmación de Reserva - Gestión logística Colombiana',
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: 'Helvetica', sans-serif;
                    background-color: #f4f4f4;
                    padding: 0;
                    margin: 0;
                }
                .container {
                    max-width: 600px;
                    margin: auto;
                    background: white;
                    border: 1px solid #e1e1e1;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                .header {
                    background: black;
                    color: gold;
                    padding: 20px;
                    text-align: center;
                }
                .content {
                    padding: 20px;
                }
                h1 {
                    margin: 0;
                    font-size: 24px;
                }
                p {
                    line-height: 1.6;
                    color: #333;
                }
                .footer {
                    text-align: center;
                    padding: 10px;
                    font-size: 12px;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Gestión logística Colombiana</h1>
                </div>
                <div class="content">
                    <h2>Estimado Usuario,</h2>
                    <p>Hemos recibido su reserva con éxito. Nos pondremos en contacto pronto.</p>
                </div>
                <div class="footer">
                    <p>© 2024 Gestión logística Colombiana. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
        </html>
      `,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Correo de reserva enviado a:', email);
    } catch (error) {
      console.error('Error al enviar el correo de reserva:', error);
      throw error;
    }
  };




  // Admin Reservas

  
  // Confirmación de reserva
const conReservationEmail = async (email) => {
    const mailOptions = {
      from: 'logísticacolombianalpc@gmail.com',
      to: email,
      subject: 'Confirmación de Reserva - Gestión logística Colombiana',
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: 'Helvetica', sans-serif;
                    background-color: #f4f4f4;
                    padding: 0;
                    margin: 0;
                }
                .container {
                    max-width: 600px;
                    margin: auto;
                    background: white;
                    border: 1px solid #e1e1e1;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                .header {
                    background: black;
                    color: gold;
                    padding: 20px;
                    text-align: center;
                }
                .content {
                    padding: 20px;
                }
                h1 {
                    margin: 0;
                    font-size: 24px;
                }
                p {
                    line-height: 1.6;
                    color: #333;
                }
                .footer {
                    text-align: center;
                    padding: 10px;
                    font-size: 12px;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Gestión logística Colombiana</h1>
                </div>
                <div class="content">
                    <h2>Estimado Usuario,</h2>
                    <p>Su reserva ha sido confirmada con éxito. Pronto nos pondremos en contacto para los detalles adicionales.</p>
                </div>
                <div class="footer">
                    <p>© 2024 Gestión logística Colombiana. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
        </html>
      `,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Correo de confirmación de reserva enviado a:', email);
    } catch (error) {
      console.error('Error al enviar el correo de confirmación:', error);
      throw error;
    }
  };
  
  // Rechazo de reserva
  const sendRejectionEmail = async (email) => {
    const mailOptions = {
      from: 'logísticacolombianalpc@gmail.com',
      to: email,
      subject: 'Rechazo de Reserva - Gestión logística Colombiana',
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: 'Helvetica', sans-serif;
                    background-color: #f4f4f4;
                    padding: 0;
                    margin: 0;
                }
                .container {
                    max-width: 600px;
                    margin: auto;
                    background: white;
                    border: 1px solid #e1e1e1;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                .header {
                    background: black;
                    color: gold;
                    padding: 20px;
                    text-align: center;
                }
                .content {
                    padding: 20px;
                }
                h1 {
                    margin: 0;
                    font-size: 24px;
                }
                p {
                    line-height: 1.6;
                    color: #333;
                }
                .footer {
                    text-align: center;
                    padding: 10px;
                    font-size: 12px;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Gestión logística Colombiana</h1>
                </div>
                <div class="content">
                    <h2>Estimado Usuario,</h2>
                    <p>Lamentamos informarle que su solicitud de reserva no ha sido aprobada. Si tiene alguna duda, no dude en contactarnos.</p>
                </div>
                <div class="footer">
                    <p>© 2024 Gestión logística Colombiana. Todos los derechos reservados.</p>
                </div>
            </div>
        </body>
        </html>
      `,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Correo de rechazo de reserva enviado a:', email);
    } catch (error) {
      console.error('Error al enviar el correo de rechazo:', error);
      throw error;
    }
  };
  
  module.exports = { sendResetEmail, sendContactEmail, sendReservationEmail, sendRejectionEmail, conReservationEmail };