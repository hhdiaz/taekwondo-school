// Navegación móvil
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Smooth scroll para enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
            
            // Cerrar menú móvil si está abierto
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });
});

// Formulario de contacto con reCAPTCHA
document.addEventListener('DOMContentLoaded', function() {

    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    // Crear contenedor de mensajes si no existe
    let formMessages = document.getElementById('formMessages');
    if (!formMessages) {
        formMessages = document.createElement('div');
        formMessages.id = 'formMessages';
        formMessages.style.display = 'none';
        formMessages.style.marginTop = '20px';
        formMessages.style.padding = '15px';
        formMessages.style.borderRadius = '8px';
        contactForm.appendChild(formMessages);
    }

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // ✅ VERIFICAR reCAPTCHA PRIMERO - antes de cualquier otra cosa
        const recaptchaResponse = grecaptcha.getResponse();
        if (!recaptchaResponse) {
            this.showMessage('<h4>⚠️ Por favor marca la casilla "No soy un robot"</h4>', 'error');
            return;
        }

        // Obtener el botón de enviar
        const submitBtn = this.querySelector('button[type="submit"]');
        if (!submitBtn) return;

        // Guardar estado original del botón
        const originalText = submitBtn.textContent;
        const originalHTML = submitBtn.innerHTML;

        // Estado de carga
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'not-allowed';

        try {
            const formData = new FormData(this);

            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // ÉXITO
                this.showMessage(`
                    <h4>✅ ¡Mensaje enviado con éxito!</h4>
                    <p>Te contactaremos dentro de 24 horas. Gracias por tu interés en Cobas Taekwondo.</p>
                `, 'success');

                // Resetear formulario y captcha
                this.reset();
                grecaptcha.reset();

            } else {
                const errorText = await response.text();
                throw new Error(`Error ${response.status}: No se pudo enviar el formulario`);
            }

        } catch (error) {
            this.showMessage(`
                <h4>❌ Error al enviar el mensaje</h4>
                <p>Por favor intenta nuevamente o contáctanos directamente por teléfono.</p>
            `, 'error');
            grecaptcha.reset();

        } finally {
            // Restaurar el botón siempre
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
            submitBtn.innerHTML = originalHTML;
        }
    });

    // Función para mostrar mensajes de éxito/error
    contactForm.showMessage = function(message, type) {
        const formMessages = document.getElementById('formMessages');
        if (!formMessages) return;

        formMessages.style.display = 'block';
        formMessages.style.padding = '20px';
        formMessages.style.borderRadius = '8px';
        formMessages.style.marginTop = '20px';

        if (type === 'success') {
            formMessages.style.background = '#d4edda';
            formMessages.style.border = '1px solid #c3e6cb';
            formMessages.style.color = '#155724';
            formMessages.style.borderLeft = '4px solid #28a745';
        } else if (type === 'error') {
            formMessages.style.background = '#f8d7da';
            formMessages.style.border = '1px solid #f5c6cb';
            formMessages.style.color = '#721c24';
            formMessages.style.borderLeft = '4px solid #dc3545';
        }

        formMessages.innerHTML = message;

        setTimeout(() => {
            formMessages.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 100);

        if (type === 'success') {
            setTimeout(() => {
                formMessages.style.display = 'none';
            }, 10000);
        }
    };

});

// Efecto del header al hacer scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});