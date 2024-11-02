const { sendContactEmail } = require('./testEmail');

sendContactEmail('sebaspro22210@gmail.com', 'Nombre Prueba', 'Este es un mensaje de prueba')
  .then(() => console.log('Correo de prueba enviado con éxito'))
  .catch((error) => console.error('Error al enviar el correo de prueba:', error));
