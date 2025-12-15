// Carrusel para la sección About
class SimpleCarousel {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;
        
        this.slides = this.container.querySelectorAll('.carousel-slide');
        this.indicators = this.container.querySelectorAll('.indicator');
        this.prevBtn = this.container.querySelector('.prev-btn');
        this.nextBtn = this.container.querySelector('.next-btn');
        
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.autoSlideInterval = null;
        this.slideInterval = 4000; // 4 segundos
        
        this.init();
    }
    
    init() {
        if (this.totalSlides === 0) return;
        
        // Mostrar primer slide
        this.showSlide(this.currentSlide);
        
        // Event listeners para botones
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Event listeners para indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Iniciar auto-slide
        this.startAutoSlide();
        
        // Pausar auto-slide al interactuar
        this.container.addEventListener('mouseenter', () => this.stopAutoSlide());
        this.container.addEventListener('mouseleave', () => this.startAutoSlide());
        
        // Pausar auto-slide al tocar en móviles
        this.container.addEventListener('touchstart', () => this.stopAutoSlide());
        this.container.addEventListener('touchend', () => {
            setTimeout(() => this.startAutoSlide(), 3000);
        });
    }
    
    showSlide(index) {
        // Ocultar todos los slides
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Mostrar slide actual
        this.slides[index].classList.add('active');
        
        // Actualizar indicadores
        this.indicators.forEach((indicator, i) => {
            if (i === index) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
        
        this.currentSlide = index;
    }
    
    nextSlide() {
        let nextIndex = this.currentSlide + 1;
        if (nextIndex >= this.totalSlides) {
            nextIndex = 0; // Volver al inicio
        }
        this.showSlide(nextIndex);
    }
    
    prevSlide() {
        let prevIndex = this.currentSlide - 1;
        if (prevIndex < 0) {
            prevIndex = this.totalSlides - 1; // Ir al final
        }
        this.showSlide(prevIndex);
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.showSlide(index);
        }
    }
    
    startAutoSlide() {
        if (this.autoSlideInterval) {
            this.stopAutoSlide();
        }
        
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, this.slideInterval);
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar carrusel principal
    new SimpleCarousel('.carousel-container');
    
    console.log('Carrusel inicializado correctamente');
});