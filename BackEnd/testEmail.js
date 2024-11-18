const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'logisticacolombianalpc@gmail.com',
    pass: 'yfcd otek esvn gsei', // Cambia esto por una contraseña segura
  },
});

// Correo de Registro
const sendRegistrationEmail = async (email, nombre) => {
    try {
      const mailOptions = {
        from: 'logisticacolombianalpc@gmail.com',
        to: email,
        subject: '¡Registro Exitoso! Bienvenido a Gestión Logística Colombiana',
        html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                .header {
                    background-color: #333333;
                    color: #ffffff;
                    padding: 20px;
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                }
                .content {
                    padding: 20px;
                    color: #333333;
                }
                .footer {
                    text-align: center;
                    padding: 15px;
                    font-size: 12px;
                    color: #777777;
                    background-color: #f4f4f4;
                    border-top: 1px solid #ddd;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">Gestión Logística Colombiana</div>
                <div class="content">
                    <p>¡Hola ${nombre}!</p>
                    <p>Nos complace informarte que tu registro ha sido exitoso. Ahora formas parte de nuestra comunidad en Gestión Logística Colombiana.</p>
                    <p>A partir de ahora, tendrás acceso a nuestros servicios y estarás al tanto de todas nuestras actualizaciones y promociones.</p>
                    <p>En nuestra plataforma podrás gestionar tus envíos, obtener cotizaciones, y recibir soporte personalizado.</p>
                    <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos. Nuestro equipo está siempre disponible para asistirte.</p>
                    <p>¡Gracias por confiar en nosotros!</p>
                    <p>Saludos cordiales,<br>El equipo de Gestión Logística Colombiana</p>
                </div>
                <div class="footer">
                    © 2024 Gestión Logística Colombiana. Todos los derechos reservados.
                </div>
            </div>
        </body>
        </html>
        `,
      };
      await transporter.sendMail(mailOptions);
      console.log('Correo de registro enviado exitosamente');
    } catch (error) {
      console.error('Error al enviar el correo de registro:', error);
      throw new Error('Error al enviar el correo');
    }
  };
  

// Correo de contacto
const sendContactEmail = async (email, nombre, mensaje) => {
    try {
      const mailOptions = {
        from: 'logisticacolombianalpc@gmail.com',
        to: email,
        subject: 'Confirmación de contacto',
        html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                .header {
                    background-color: #333333;
                    color: #ffffff;
                    padding: 20px;
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                }
                .content {
                    padding: 20px;
                    color: #333333;
                }
                .footer {
                    text-align: center;
                    padding: 15px;
                    font-size: 12px;
                    color: #777777;
                    background-color: #f4f4f4;
                    border-top: 1px solid #ddd;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">Gestión logística Colombiana</div>
                <div class="content">
                    <p>Hola ${nombre},</p>
                    <p>Hemos recibido tu mensaje:</p>
                    <blockquote style="font-style: italic; color: #555;">"${mensaje}"</blockquote>
                    <p>Nos pondremos en contacto contigo pronto.</p>
                    <p>Saludos cordiales,<br>Equipo de Gestión logística Colombiana</p>
                </div>
                <div class="footer">
                    © 2024 Gestión logística Colombiana. Todos los derechos reservados.
                </div>
            </div>
        </body>
        </html>
        `,
      };
      await transporter.sendMail(mailOptions);
      console.log('Correo de contacto enviado exitosamente');
    } catch (error) {
      console.error('Error al enviar el correo de contacto:', error);
      throw new Error('Error al enviar el correo');
    }
  };
  
  // Correo de confirmación de reserva
  const sendReservationEmail = async (email, nombre, teatro, fecha, hora) => {
    try {
      const mailOptions = {
        from: 'logisticacolombianalpc@gmail.com',
        to: email,
        subject: 'Confirmación de Reserva - Gestión logística Colombiana',
        html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                .header {
                    background-color: #333333;
                    color: #ffffff;
                    padding: 20px;
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                }
                .content {
                    padding: 20px;
                    color: #333333;
                }
                .footer {
                    text-align: center;
                    padding: 15px;
                    font-size: 12px;
                    color: #777777;
                    background-color: #f4f4f4;
                    border-top: 1px solid #ddd;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">Gestión logística Colombiana</div>
                <div class="content">
                    <p>Estimado ${nombre},</p>
                    <p>Hemos recibido su reserva en el teatro <strong>${teatro}</strong> para el día <strong>${fecha}</strong> a las <strong>${hora}</strong>.</p>
                    <p>Nos pondremos en contacto pronto para los detalles adicionales.</p>
                    <p>Saludos cordiales,<br>Equipo de Gestión logística Colombiana</p>
                </div>
                <div class="footer">
                    © 2024 Gestión logística Colombiana. Todos los derechos reservados.
                </div>
            </div>
        </body>
        </html>
        `,
      };
      await transporter.sendMail(mailOptions);
      console.log('Correo de reserva enviado a:', email);
    } catch (error) {
      console.error('Error al enviar el correo de reserva:', error);
      throw error;
    }
  };
  

// Correo de restablecimiento de contraseña
const sendResetEmail = async (email, nombre, resetLink) => {
    try {
      const mailOptions = {
        from: 'logisticacolombianalpc@gmail.com',
        to: email,
        subject: 'Restablecimiento de Contraseña - Gestión logística Colombiana',
        html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                .header {
                    background-color: #333333;
                    color: #ffffff;
                    padding: 20px;
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                }
                .content {
                    padding: 20px;
                    color: #333333;
                }
                .footer {
                    text-align: center;
                    padding: 15px;
                    font-size: 12px;
                    color: #777777;
                    background-color: #f4f4f4;
                    border-top: 1px solid #ddd;
                }
                .button {
                    display: inline-block;
                    padding: 12px 18px;
                    color: #ffffff;
                    background-color: #000000;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">Gestión logística Colombiana</div>
                <div class="content">
                    <p>Estimado ${nombre},</p>
                    <p>Hemos recibido una solicitud para restablecer la contraseña de su cuenta.</p>
                    <p>Para continuar, haga clic en el siguiente enlace:</p>
                    <a href="${resetLink}" class="button">Restablecer Contraseña</a>
                    <p>Si no solicitó este cambio, puede ignorar este correo y su contraseña permanecerá segura.</p>
                </div>
                <div class="footer">
                    © 2024 Gestión logística Colombiana. Todos los derechos reservados.
                </div>
            </div>
        </body>
        </html>
        `,
      };
      await transporter.sendMail(mailOptions);
      console.log('Correo de restablecimiento de contraseña enviado a:', email);
    } catch (error) {
      console.error('Error al enviar el correo de restablecimiento:', error);
      throw error;
    }
  };
  
  
  
  // Correo de confirmación de reserva aprobada
  const conReservationEmail = async (email, nombre, teatro, fecha, hora) => {
    try {
      const mailOptions = {
        from: 'logisticacolombianalpc@gmail.com',
        to: email,
        subject: 'Confirmación de Reserva - Gestión logística Colombiana',
        html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                .header {
                    background-color: #333333;
                    color: #ffffff;
                    padding: 20px;
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                }
                .content {
                    padding: 20px;
                    color: #333333;
                }
                .footer {
                    text-align: center;
                    padding: 15px;
                    font-size: 12px;
                    color: #777777;
                    background-color: #f4f4f4;
                    border-top: 1px solid #ddd;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">Gestión logística Colombiana</div>
                <div class="content">
                    <p>Estimado ${nombre},</p>
                    <p>Su reserva en el teatro <strong>${teatro}</strong> para el día <strong>${fecha}</strong> a las <strong>${hora}</strong> ha sido confirmada con éxito.</p>
                    <p>Pronto nos pondremos en contacto para los detalles adicionales.</p>
                    <p>Saludos cordiales,<br>Equipo de Gestión logística Colombiana</p>
                </div>
                <div class="footer">
                    © 2024 Gestión logística Colombiana. Todos los derechos reservados.
                </div>
            </div>
        </body>
        </html>
        `,
      };
      await transporter.sendMail(mailOptions);
      console.log('Correo de confirmación de reserva enviado a:', email);
    } catch (error) {
      console.error('Error al enviar el correo de confirmación:', error);
      throw error;
    }
  };
  
  // Correo de rechazo de reserva
  const sendRejectionEmail = async (email, nombre, teatro, fecha, hora) => {
    try {
      const mailOptions = {
        from: 'logisticacolombianalpc@gmail.com',
        to: email,
        subject: 'Rechazo de Reserva - Gestión logística Colombiana',
        html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                .header {
                    background-color: #333333;
                    color: #ffffff;
                    padding: 20px;
                    text-align: center;
                    font-size: 24px;
                    font-weight: bold;
                }
                .content {
                    padding: 20px;
                    color: #333333;
                }
                .footer {
                    text-align: center;
                    padding: 15px;
                    font-size: 12px;
                    color: #777777;
                    background-color: #f4f4f4;
                    border-top: 1px solid #ddd;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">Gestión logística Colombiana</div>
                <div class="content">
                    <p>Estimado ${nombre},</p>
                    <p>Lamentamos informarle que su solicitud de reserva en el teatro <strong>${teatro}</strong> para el día <strong>${fecha}</strong> a las <strong>${hora}</strong> no ha sido aprobada.</p>
                    <p>Si tiene alguna duda, no dude en contactarnos.</p>
                    <p>Saludos cordiales,<br>Equipo de Gestión logística Colombiana</p>
                </div>
                <div class="footer">
                    © 2024 Gestión logística Colombiana. Todos los derechos reservados.
                </div>
            </div>
        </body>
        </html>
        `,
      };
      await transporter.sendMail(mailOptions);
      console.log('Correo de rechazo de reserva enviado a:', email);
    } catch (error) {
      console.error('Error al enviar el correo de rechazo:', error);
      throw error;
    }
  };
  

module.exports = {
  sendContactEmail,
  sendReservationEmail,
  sendResetEmail,
  conReservationEmail,
  sendRejectionEmail,
  sendRegistrationEmail
};
