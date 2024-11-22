const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();
 
// Ruta para renderizar el formulario
router.get('/', (req, res) => {
    res.render('formulario');
});
 
// Ruta para manejar el envío del formulario
router.post('/enviar-correo', async (req, res) => {
    const {
        nombre_completo,
        cedula,
        fecha_nacimiento,
        dia_reserva,
        numero_personas,
        telefono,
        correo,
        observaciones,
        menu
    } = req.body;
 
    // Configurar el transporte de correo
    const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com', // Servidor SMTP de Outlook
        port: 587,                  // Puerto SMTP
        secure: false,              // true para 465, false para otros puertos
        auth: {
            user: process.env.EMAIL_USER, // Tu correo electrónico de Outlook
            pass: process.env.EMAIL_PASS, // Tu contraseña de Outlook
        },
        tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized: false
        }
    });
 
    // Contenido del correo para el destinatario interno
    const emailContent = `
                    Nueva Reserva
        Nombre: ${nombre_completo}
        Cédula: ${cedula}
        Fecha de Nacimiento: ${fecha_nacimiento}
        Día de Reserva: ${dia_reserva}
        Número de Personas: ${numero_personas}
        Teléfono: ${telefono}
        Correo: ${correo}
        Platos Seleccionados:\n${menu ? menu.map(item => `        ${item}`).join('\n') : 'Ninguno'}
        Observaciones: ${observaciones}
    `;
 
    try {
        // Enviar correo de confirmación al cliente
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: correo,
            subject: 'Confirmación de Reserva',
            text: '¡Felicidades Ganaste un 10% de descuento en tu reserva! Su reserva está hecha Para el dia ' + dia_reserva
        });

 
        // Enviar correo con detalles de la reserva al destinatario interno
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.RECIPIENT_EMAIL,
            subject: 'Nueva Reserva',
            text: emailContent
        });
 
        res.json({ success: true, message: 'Reserva enviada exitosamente' });
    } catch (error) {
        console.error('Error al enviar email:', error);
        res.status(500).json({ success: false, message: 'Error al enviar la reserva' });
    }
});
 
module.exports = router;