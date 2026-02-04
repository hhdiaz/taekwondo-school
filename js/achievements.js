// Animación de números en logros
class AchievementsCounter {
    constructor() {
        this.counters = document.querySelectorAll('.counter');
        this.achievementsSection = document.querySelector('.achievements');
        this.init();
    }
    
    init() {
        if (this.counters.length === 0) return;
        
        // Observer para animar cuando la sección sea visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.startCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        });
        
        if (this.achievementsSection) {
            observer.observe(this.achievementsSection);
        }
        
        // También animar al cargar si ya está visible
        if (this.isElementInViewport(this.achievementsSection)) {
            setTimeout(() => this.startCounters(), 500);
        }
    }
    
    isElementInViewport(el) {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    startCounters() {
        this.counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000; // 2 segundos
            const increment = target / (duration / 16); // 60fps
            
            let current = 0;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current).toLocaleString('es-ES');
            }, 16);
        });
        
        // Agregar clase de animación a las tarjetas
        const cards = document.querySelectorAll('.achievement-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animated');
            }, index * 200);
        });
    }
}

// Efecto de aparición gradual para las tarjetas
class CardsAnimation {
    constructor() {
        this.cards = document.querySelectorAll('.achievement-card');
        this.init();
    }
    
    init() {
        if (this.cards.length === 0) return;
        
        // Observer para animar cuando entren en viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        this.cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    new AchievementsCounter();
    new CardsAnimation();
    
    console.log('Animaciones de logros inicializadas');
});

// También animar al hacer scroll
window.addEventListener('scroll', function() {
    const achievementsSection = document.querySelector('.achievements');
    if (achievementsSection && !achievementsSection.classList.contains('counted')) {
        const rect = achievementsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8 && rect.bottom >= 0) {
            achievementsSection.classList.add('counted');
            // Los contadores ya se animan con el observer
        }
    }
});