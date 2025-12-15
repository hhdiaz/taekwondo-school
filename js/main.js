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
    // console.log('🔧 Inicializando formulario de contacto...');
    
    const contactForm = document.getElementById('contactForm');
    // debug
    // if (!contactForm) {
    //     console.error('❌ Formulario con ID "contactForm" no encontrado en la página');
    //     return;
    // }

    // console.log('✅ Formulario encontrado:', contactForm);

    // Crear contenedor de mensajes si no existe
    let formMessages = document.getElementById('formMessages');
    if (!formMessages) {
        // console.log('📝 Creando contenedor de mensajes...');
        formMessages = document.createElement('div');
        formMessages.id = 'formMessages';
        formMessages.style.display = 'none';
        formMessages.style.marginTop = '20px';
        formMessages.style.padding = '15px';
        formMessages.style.borderRadius = '8px';
        contactForm.appendChild(formMessages);
        // console.log('✅ Contenedor de mensajes creado');
    }

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // console.log('🚀 Iniciando envío del formulario...');

        // Obtener el botón de enviar de forma segura
        const submitBtn = this.querySelector('button[type="submit"]');
        if (!submitBtn) {
            console.error('❌ Botón de enviar no encontrado');
            this.showMessage('Error: Botón no encontrado', 'error');
            return;
        }

        // Guardar texto original y estado
        const originalText = submitBtn.textContent;
        const originalHTML = submitBtn.innerHTML;
        
        // Estado de carga
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'not-allowed';

        try {
            // console.log('📤 Enviando datos a Formspree...');
            
            const formData = new FormData(this);
            
            // Mostrar datos que se enviarán (para debug)
            for (let [key, value] of formData.entries()) {
                // console.log(`📋 ${key}: ${value}`);
            }

            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            // console.log('📨 Respuesta recibida. Status:', response.status);

            if (response.ok) {
                // ÉXITO
                // console.log('✅ Formulario enviado exitosamente');
                this.showMessage(`
                    <h4>✅ ¡Mensaje enviado con éxito!</h4>
                    <p>Te contactaremos dentro de 24 horas. Gracias por tu interés en Cobas Taekwondo.</p>
                `, 'success');
                
                // Resetear formulario
                this.reset();
                
            } else {
                // ERROR DEL SERVIDOR
                const errorText = await response.text();
                console.error('❌ Error del servidor:', response.status, errorText);
                throw new Error(`Error ${response.status}: No se pudo enviar el formulario`);
            }
            
        } catch (error) {
            // ERROR DE CONEXIÓN
            console.error('❌ Error de conexión:', error);
            this.showMessage(`
                <h4>❌ Error al enviar el mensaje</h4>
                <p>Por favor intenta nuevamente o contáctanos directamente por teléfono.</p>
                <small><strong>Error técnico:</strong> ${error.message}</small>
            `, 'error');
            
        } finally {
            // Siempre restaurar el botón
            // console.log('🔄 Restaurando estado del botón...');
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
            submitBtn.textContent = originalText;
            submitBtn.innerHTML = originalHTML;
            // console.log('✅ Botón restaurado');
        }
    });

    // Función helper para mostrar mensajes
    contactForm.showMessage = function(message, type) {
        const formMessages = document.getElementById('formMessages');
        if (!formMessages) {
            console.error('❌ No se puede mostrar mensaje: contenedor no encontrado');
            return;
        }

        // Estilos según el tipo
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

        // Scroll suave al mensaje
        setTimeout(() => {
            formMessages.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
        }, 100);

        // Auto-ocultar mensajes de éxito después de 10 segundos
        if (type === 'success') {
            setTimeout(() => {
                formMessages.style.display = 'none';
            }, 10000);
        }
    };

            // Inicializar carrusel si existe el archivo
            if (typeof SimpleCarousel !== 'undefined') {
                new SimpleCarousel('.carousel-container');
            }

    // console.log('🎉 Formulario de contacto inicializado correctamente');
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