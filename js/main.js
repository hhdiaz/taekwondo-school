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
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) {
        console.log('Formulario no encontrado');
        return;
    }

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        console.log('Formulario enviado'); // Para debug
        
        // Obtener el botón de enviar
        const submitBtn = this.querySelector('button[type="submit"]');
        if (!submitBtn) {
            console.error('Botón de enviar no encontrado');
            return;
        }
        
        // Guardar texto original
        const originalText = submitBtn.textContent;
        
        // Estado de carga
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        // Buscar o crear contenedor de mensajes
        let formMessages = document.getElementById('formMessages');
        if (!formMessages) {
            formMessages = document.createElement('div');
            formMessages.id = 'formMessages';
            formMessages.style.display = 'none';
            this.appendChild(formMessages);
        }
        
        // Ocultar y limpiar mensajes anteriores
        formMessages.style.display = 'none';
        formMessages.className = '';
        formMessages.innerHTML = '';
        
        try {
            console.log('Enviando datos a Formspree...');
            
            const formData = new FormData(this);
            
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            console.log('Respuesta recibida:', response.status);
            
            if (response.ok) {
                // ÉXITO
                formMessages.style.display = 'block';
                formMessages.className = 'form-success';
                formMessages.innerHTML = `
                    <h4>✅ ¡Mensaje enviado con éxito!</h4>
                    <p>Te contactaremos dentro de 24 horas. Gracias por tu interés en Cobas Taekwondo.</p>
                `;
                
                // Resetear formulario
                this.reset();
                
                // Scroll suave al mensaje
                formMessages.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                });
                
                console.log('Formulario enviado exitosamente');
                
            } else {
                // ERROR DEL SERVIDOR
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
        } catch (error) {
            // ERROR DE CONEXIÓN
            console.error('Error al enviar formulario:', error);
            
            formMessages.style.display = 'block';
            formMessages.className = 'form-error';
            formMessages.innerHTML = `
                <h4>❌ Error al enviar el mensaje</h4>
                <p>Por favor intenta nuevamente o contáctanos directamente por teléfono.</p>
                <small>Error: ${error.message}</small>
            `;
            
            // Scroll al error
            formMessages.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
            
        } finally {
            // Siempre restaurar el botón
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            console.log('Estado del botón restaurado');
        }
    });
    
    console.log('Formulario de contacto inicializado correctamente');
});

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