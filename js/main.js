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

// Formulario de contacto
// Formspree Integration
const contactForm = document.getElementById('contactForm');
const formMessages = document.getElementById('formMessages');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Mostrar estado de carga
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        // Ocultar mensajes anteriores
        formMessages.style.display = 'none';
        formMessages.className = '';
        
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
                // Éxito
                formMessages.style.display = 'block';
                formMessages.className = 'form-success';
                formMessages.innerHTML = `
                    <h4>¡Mensaje enviado con éxito!</h4>
                    <p>Te contactaremos dentro de 24 horas. Gracias por tu interés en Cobas Taekwondo.</p>
                `;
                
                // Resetear formulario
                this.reset();
                
                // Scroll to message
                formMessages.scrollIntoView({ behavior: 'smooth' });
                
            } else {
                throw new Error('Error en el servidor');
            }
            
        } catch (error) {
            // Error
            formMessages.style.display = 'block';
            formMessages.className = 'form-error';
            formMessages.innerHTML = `
                <h4>Error al enviar el mensaje</h4>
                <p>Por favor intenta nuevamente o contáctanos directamente por teléfono.</p>
            `;
            
            console.error('Error:', error);
            
        } finally {
            // Restaurar botón
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Header scroll effect
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