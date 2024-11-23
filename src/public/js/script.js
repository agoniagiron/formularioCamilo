require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('responseModal'); // Reemplaza 'miFormulario' con el ID real de tu formulario
    const modal = document.getElementById('responseModal');
    const modalMessage = document.getElementById('modalMessage');

    // Ensure form action doesn't redirect
    form.setAttribute('action', 'javascript:void(0)');

    function showModal(message) {
        modalMessage.textContent = message;
        modal.style.display = 'block';
    }

    window.closeModal = function() {
        modal.style.display = 'none';
        // Optionally refresh or redirect after closing modal
        // window.location.reload();
    }

    form.addEventListener('submit', async function(event) {
        event.preventDefault(); // Evita el envío tradicional del formulario

        const formData = new FormData(form);

        try {
            const response = await fetch('/enviar-correo', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            // Muestra el mensaje en un modal
            mostrarModal(result.message);
        } catch (error) {
            console.error('Error al enviar la reserva:', error);
            mostrarModal('Error al enviar la reserva. Por favor, inténtalo de nuevo.');
        }
    });

    // Función para crear y mostrar el modal
    function mostrarModal(mensaje) {
        // Crea el contenedor del modal
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'modalOverlay';
        modalOverlay.style.position = 'fixed';
        modalOverlay.style.top = '0';
        modalOverlay.style.left = '0';
        modalOverlay.style.width = '100%';
        modalOverlay.style.height = '100%';
        modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modalOverlay.style.display = 'flex';
        modalOverlay.style.alignItems = 'center';
        modalOverlay.style.justifyContent = 'center';
        modalOverlay.style.zIndex = '1000';

        // Crea el contenido del modal
        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = '#fff';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '8px';
        modalContent.style.textAlign = 'center';
        modalContent.style.maxWidth = '400px';
        modalContent.style.width = '80%';

        // Agrega el mensaje al contenido del modal
        const modalMessage = document.createElement('p');
        modalMessage.textContent = mensaje;

        // Crea el botón de cerrar
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Cerrar';
        closeButton.style.marginTop = '15px';
        closeButton.addEventListener('click', function() {
            document.body.removeChild(modalOverlay);
        });

        // Arma el modal
        modalContent.appendChild(modalMessage);
        modalContent.appendChild(closeButton);
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
    }
});