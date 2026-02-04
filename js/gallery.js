// Galería Simple con carga de fotos ocultas
class SimpleGallery {
    constructor() {
        this.galleryContainer = document.querySelector('.gallery-grid-square');
        this.galleryItems = document.querySelectorAll('.gallery-item-square');
        this.hiddenPhotos = document.querySelectorAll('.hidden-photo');
        this.filterButtons = document.querySelectorAll('.filter-btn-simple');
        this.lightbox = document.getElementById('simple-lightbox');
        this.lightboxImg = document.querySelector('.lightbox-img');
        this.lightboxCategory = document.getElementById('lightbox-category-text');
        this.loadMoreBtn = document.querySelector('.load-more-btn');
        this.photoCountElement = document.getElementById('photo-count');
        this.totalPhotosElement = document.getElementById('total-photos');
        
        this.currentFilter = 'all';
        this.initialPhotos = 9; // Fotos visibles al inicio
        this.photosLoaded = this.initialPhotos;
        this.photosPerLoad = 6; // Cuántas fotos cargar por clic
        this.totalPhotos = this.galleryItems.length;
        
        this.init();
    }
    
    init() {
        console.log('Inicializando galería...');
        
        // Configurar total de fotos
        if (this.totalPhotosElement) {
            this.totalPhotosElement.textContent = this.totalPhotos;
        }
        
        // Inicializar filtros
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.filterGallery(e.target));
        });
        
        // Inicializar lightbox
        this.initLightbox();
        
        // Inicializar botón "Cargar más fotos"
        this.initLoadMoreButton();
        
        // Actualizar contador inicial
        this.updateCounter();
        
        console.log(`Galería lista: ${this.initialPhotos} fotos visibles de ${this.totalPhotos}`);
    }
    
    filterGallery(clickedButton) {
        const filter = clickedButton.getAttribute('data-filter');
        
        // Actualizar botones activos
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        clickedButton.classList.add('active');
        
        this.currentFilter = filter;
        this.applyFilter(filter);
    }
    
    applyFilter(filter) {
        console.log(`Aplicando filtro: ${filter}`);
        
        let visibleCount = 0;
        
        this.galleryItems.forEach((item, index) => {
            const category = item.getAttribute('data-category');
            const isHidden = item.classList.contains('hidden-photo');
            const isLoaded = !isHidden || item.dataset.loaded === 'true';
            
            // Resetear estilos
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            
            setTimeout(() => {
                if ((filter === 'all' || category === filter) && isLoaded) {
                    // Mostrar item
                    item.style.display = 'block';
                    visibleCount++;
                    
                    // Animación de entrada escalonada
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, index * 50);
                } else {
                    // Ocultar item
                    item.style.display = 'none';
                }
            }, 150);
        });
        
        // Actualizar contador
        this.updateCounter(visibleCount);
    }
    
    updateCounter(count = null) {
        if (!this.photoCountElement) return;
        
        if (count === null) {
            // Contar fotos visibles según el filtro actual
            let visibleCount = 0;
            this.galleryItems.forEach(item => {
                const isHidden = item.classList.contains('hidden-photo');
                const isLoaded = !isHidden || item.dataset.loaded === 'true';
                const category = item.getAttribute('data-category');
                const isVisible = window.getComputedStyle(item).display !== 'none';
                
                if ((this.currentFilter === 'all' || category === this.currentFilter) && 
                    isLoaded && 
                    isVisible) {
                    visibleCount++;
                }
            });
            
            this.photoCountElement.textContent = visibleCount;
        } else {
            this.photoCountElement.textContent = count;
        }
    }
    
    initLightbox() {
        // Cerrar lightbox con botón
        document.getElementById('close-lightbox-btn')?.addEventListener('click', () => {
            this.closeLightbox();
        });
        
        // Cerrar al hacer clic fuera de la imagen
        this.lightbox?.addEventListener('click', (e) => {
            if (e.target === this.lightbox || e.target.classList.contains('lightbox-image-container')) {
                this.closeLightbox();
            }
        });
        
        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeLightbox();
            }
        });
        
        // Delegación de eventos para abrir lightbox
        this.galleryContainer.addEventListener('click', (e) => {
            const galleryItem = e.target.closest('.gallery-item-square');
            
            if (galleryItem && window.getComputedStyle(galleryItem).display !== 'none') {
                this.openLightbox(galleryItem);
            }
        });
    }
    
    openLightbox(item) {
        // Obtener datos de la imagen
        const imgSrc = item.querySelector('img').src;
        const imgAlt = item.querySelector('img').alt;
        const category = item.querySelector('.photo-category')?.textContent || 'Galería';
        
        // Actualizar lightbox
        this.lightboxImg.src = imgSrc;
        this.lightboxImg.alt = imgAlt;
        this.lightboxCategory.textContent = category;
        
        // Mostrar lightbox
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    initLoadMoreButton() {
        if (!this.loadMoreBtn) return;
        
        this.loadMoreBtn.addEventListener('click', () => {
            this.loadMorePhotos();
        });
        
        // Verificar estado inicial del botón
        this.checkLoadMoreButton();
    }
    
    loadMorePhotos() {
        if (this.photosLoaded >= this.totalPhotos) {
            this.hideLoadMoreButton();
            return;
        }
        
        // Estado de carga
        const originalHTML = this.loadMoreBtn.innerHTML;
        this.loadMoreBtn.classList.add('loading');
        this.loadMoreBtn.innerHTML = `
            <span>Cargando...</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2V6M12 18V22M4 12H8M16 12H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `;
        this.loadMoreBtn.disabled = true;
        
        // Simular carga
        setTimeout(() => {
            this.showMorePhotos();
            
            // Restaurar botón
            this.loadMoreBtn.classList.remove('loading');
            this.loadMoreBtn.innerHTML = originalHTML;
            this.loadMoreBtn.disabled = false;
            
            // Verificar si aún quedan fotos
            this.checkLoadMoreButton();
            
        }, 800);
    }
    
    showMorePhotos() {
        // Obtener fotos ocultas no cargadas
        const hiddenPhotosArray = Array.from(this.hiddenPhotos);
        const photosToShow = hiddenPhotosArray
            .filter(photo => !photo.dataset.loaded)
            .slice(0, this.photosPerLoad);
        
        if (photosToShow.length === 0) return;
        
        console.log(`Mostrando ${photosToShow.length} fotos adicionales`);
        
        photosToShow.forEach((photo, index) => {
            // Marcar como cargada
            photo.dataset.loaded = 'true';
            
            // Preparar para animación
            photo.style.opacity = '0';
            photo.style.transform = 'translateY(20px) scale(0.95)';
            photo.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            // Remover clase hidden
            setTimeout(() => {
                photo.classList.remove('hidden-photo');
                
                // Aplicar animación
                setTimeout(() => {
                    photo.style.opacity = '1';
                    photo.style.transform = 'translateY(0) scale(1)';
                    
                    // Verificar si debe mostrarse según el filtro actual
                    const category = photo.getAttribute('data-category');
                    if (this.currentFilter === 'all' || category === this.currentFilter) {
                        photo.style.display = 'block';
                    }
                    
                    // Limpiar estilos después de la animación
                    setTimeout(() => {
                        photo.style.opacity = '';
                        photo.style.transform = '';
                        photo.style.transition = '';
                    }, 500);
                    
                }, 100);
                
            }, index * 100);
        });
        
        // Actualizar contadores
        this.photosLoaded += photosToShow.length;
        this.updateCounter();
        
        console.log(`Total fotos cargadas: ${this.photosLoaded}/${this.totalPhotos}`);
    }
    
    checkLoadMoreButton() {
        const remainingPhotos = this.totalPhotos - this.photosLoaded;
        
        if (remainingPhotos <= 0) {
            this.hideLoadMoreButton();
        } else {
            // Actualizar texto del botón si quieres mostrar cuántas quedan
            const btnText = this.loadMoreBtn.querySelector('span');
            if (btnText && remainingPhotos < this.photosPerLoad) {
                btnText.textContent = `Cargar últimas ${remainingPhotos} fotos`;
            }
        }
    }
    
    hideLoadMoreButton() {
        if (this.loadMoreBtn) {
            this.loadMoreBtn.classList.add('hidden');
            
            // Actualizar contador final
            if (this.photoCountElement) {
                this.photoCountElement.textContent = this.totalPhotos;
            }
            
            console.log('Todas las fotos han sido cargadas');
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    const gallery = new SimpleGallery();
    
    // Hacer disponible globalmente para debugging
    window.gallery = gallery;
});