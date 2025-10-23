// FAQ Accordion mejorado
class FAQ {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        this.init();
    }
    
    init() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Cerrar otros items abiertos
                this.faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-answer').classList.remove('active');
                    }
                });
                
                // Abrir/cerrar el item actual
                item.classList.toggle('active');
                const answer = item.querySelector('.faq-answer');
                answer.classList.toggle('active');
            });
        });
    }
}

// Animaciones al hacer scroll
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, this.observerOptions);

        // Observar elementos para animación
        const animatedElements = document.querySelectorAll('.course-card, .instructor-card, .schedule-card, .faq-item');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    new FAQ();
    new ScrollAnimations();
    
    console.log('Cobas Taekwondo - Sitio cargado correctamente');
});