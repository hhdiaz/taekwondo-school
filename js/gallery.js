// Galería ÚNICA - Versión Simplificada
class TaekwondoGallery {
    constructor() {
        this.galleryItems = document.querySelectorAll('.gallery-item-square');
        this.filterButtons = document.querySelectorAll('.filter-btn-simple');
        this.hiddenPhotos = document.querySelectorAll('.hidden-photo');
        this.loadMoreBtn = document.querySelector('.load-more-btn');
        this.lightbox = document.getElementById('simple-lightbox');
        
        console.log(`Iniciando galería: ${this.galleryItems.length} fotos totales`);
        console.log(`Fotos ocultas: ${this.hiddenPhotos.length}`);
        
        this.init();
    }
    
    init() {
        // 1. Configurar filtros
        this.setupFilters();
        
        // 2. Configurar botón "Cargar más"
        this.setupLoadMore();
        
        // 3. Configurar lightbox
        this.setupLightbox();
        
        // 4. Actualizar contador inicial
        this.updateCounter();
    }
    
    setupFilters() {
        console.log(`Configurando ${this.filterButtons.length} botones de filtro`);
        
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Prevenir comportamiento por defecto
                e.preventDefault();
                
                // Obtener el filtro
                const filter = btn.getAttribute('data-filter');
                console.log(`Filtro seleccionado: ${filter}`);
                
                // Actualizar botón activo
                this.filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Aplicar filtro
                this.applyFilter(filter);
            });
        });
    }
    
    applyFilter(filter) {
        console.log(`Aplicando filtro: ${filter}`);
        
        let visibleCount = 0;
        
        this.galleryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            const isHidden = item.classList.contains('hidden-photo');
            const isLoaded = !isHidden || item.dataset.loaded === 'true';
            
            // Si no está cargado, ocultar y salir
            if (!isLoaded) {
                item.style.display = 'none';
                return;
            }
            
            // Determinar si debe mostrarse
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                // Mostrar con animación
                item.style.display = 'block';
                
                // Pequeña animación
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
                
                visibleCount++;
            } else {
                // Ocultar con animación
                item.style.opacity = '0';
                item.style.transform = 'scale(0.9)';
                
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
        
        // Actualizar contador
        this.updateCounter(visibleCount);
        console.log(`Fotos visibles: ${visibleCount}`);
    }
    
    updateCounter(count = null) {
        const counter = document.getElementById('photo-count');
        if (!counter) return;
        
        if (count === null) {
            // Contar manualmente
            let visible = 0;
            this.galleryItems.forEach(item => {
                if (window.getComputedStyle(item).display !== 'none') {
                    visible++;
                }
            });
            counter.textContent = visible;
        } else {
            counter.textContent = count;
        }
    }
    
    setupLoadMore() {
        if (!this.loadMoreBtn) return;
        
        this.loadMoreBtn.addEventListener('click', () => {
            this.loadMorePhotos();
        });
        
        // Verificar si ya están todas las fotos cargadas
        this.checkLoadMoreButton();
    }
    
    loadMorePhotos() {
        const hiddenArray = Array.from(this.hiddenPhotos);
        const photosToLoad = hiddenArray
            .filter(photo => !photo.dataset.loaded)
            .slice(0, 6); // Cargar 6 fotos por clic
        
        if (photosToLoad.length === 0) {
            this.loadMoreBtn.style.display = 'none';
            return;
        }
        
        // Mostrar estado de carga
        this.loadMoreBtn.innerHTML = '<span>Cargando...</span>';
        this.loadMoreBtn.disabled = true;
        
        // Simular carga
        setTimeout(() => {
            photosToLoad.forEach((photo, index) => {
                // Marcar como cargada
                photo.dataset.loaded = 'true';
                
                // Mostrar con animación
                setTimeout(() => {
                    photo.classList.remove('hidden-photo');
                    photo.style.display = 'block';
                    photo.style.opacity = '0';
                    photo.style.transform = 'translateY(20px)';
                    
                    // Animación de entrada
                    setTimeout(() => {
                        photo.style.opacity = '1';
                        photo.style.transform = 'translateY(0)';
                        photo.style.transition = 'all 0.4s ease';
                    }, 100);
                    
                    // Aplicar filtro actual
                    const category = photo.getAttribute('data-category');
                    const activeFilter = document.querySelector('.filter-btn-simple.active')?.getAttribute('data-filter') || 'all';
                    
                    if (activeFilter === 'all' || category === activeFilter) {
                        photo.style.display = 'block';
                    } else {
                        photo.style.display = 'none';
                    }
                    
                }, index * 100);
            });
            
            // Restaurar botón
            this.loadMoreBtn.innerHTML = '<span>Cargar más fotos</span>';
            this.loadMoreBtn.disabled = false;
            
            // Actualizar contador
            this.updateCounter();
            
            // Verificar si quedan más fotos
            this.checkLoadMoreButton();
            
        }, 800);
    }
    
    checkLoadMoreButton() {
        const hiddenArray = Array.from(this.hiddenPhotos);
        const remaining = hiddenArray.filter(photo => !photo.dataset.loaded).length;
        
        if (remaining <= 0) {
            this.loadMoreBtn.style.display = 'none';
        }
    }
    
    setupLightbox() {
        const lightbox = this.lightbox;
        const closeBtn = document.getElementById('close-lightbox-btn');
        const lightboxImg = document.querySelector('.lightbox-img');
        const categoryText = document.getElementById('lightbox-category-text');
        
        if (!lightbox) return;
        
        // Abrir lightbox al hacer clic en cualquier foto
        document.addEventListener('click', (e) => {
            const galleryItem = e.target.closest('.gallery-item-square');
            
            if (galleryItem && window.getComputedStyle(galleryItem).display !== 'none') {
                const img = galleryItem.querySelector('img');
                const category = galleryItem.querySelector('.photo-category')?.textContent || 'Galería';
                
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                categoryText.textContent = category;
                
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
        
        // Cerrar lightbox
        closeBtn?.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
        
        // Cerrar al hacer clic fuera
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// Inicializar SOLO UNA VEZ cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado - Inicializando galería Taekwondo');
    
    // Limpiar cualquier instancia anterior
    if (window.taekwondoGallery) {
        console.log('Limpiando instancia anterior...');
        window.taekwondoGallery = null;
    }
    
    // Crear nueva instancia
    window.taekwondoGallery = new TaekwondoGallery();
    
    // Para debugging
    console.log('Galería inicializada. Comandos disponibles:');
    console.log('- window.taekwondoGallery.applyFilter("entrenamiento")');
    console.log('- window.taekwondoGallery.updateCounter()');
});