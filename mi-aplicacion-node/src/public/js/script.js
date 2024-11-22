require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
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
        event.preventDefault(); // Prevent form submission

        const formData = {
            nombre_completo: document.getElementById('nombre_completo').value,
            cedula: document.getElementById('cedula').value,
            fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
            dia_reserva: document.getElementById('dia_reserva').value,
            numero_personas: document.getElementById('numero_personas').value,
            telefono: document.getElementById('telefono').value,
            correo: document.getElementById('correo').value,
            observaciones: document.getElementById('observaciones').value,
            menu: Array.from(document.querySelectorAll('input[name="menu[]"]:checked'))
                      .map(checkbox => checkbox.value)
        };

        try {
            const response = await fetch('/enviar-correo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            
            if (data.success) {
                showModal('¡Reserva enviada exitosamente!');
                form.reset();
            } else {
                showModal('Error al enviar la reserva: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            showModal('Error al enviar la reserva. Por favor intente nuevamente.');
        }
    });
});