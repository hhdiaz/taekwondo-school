// Galería Cobas Taekwondo
class TaekwondoGallery {
    constructor() {
        this.galleryItems = document.querySelectorAll('.gallery-item-square');
        this.hiddenPhotos = document.querySelectorAll('.hidden-photo');
        this.loadMoreBtn = document.querySelector('.load-more-btn');
        this.lightbox = document.getElementById('simple-lightbox');
        this.init();
    }

    init() {
        this.setupLoadMore();
        this.setupLightbox();
    }

    setupLoadMore() {
        if (!this.loadMoreBtn) return;

        this.loadMoreBtn.addEventListener('click', () => {
            this.loadMorePhotos();
        });

        this.checkLoadMoreButton();
    }

    loadMorePhotos() {
        const hiddenArray = Array.from(this.hiddenPhotos);
        const photosToLoad = hiddenArray
            .filter(photo => !photo.dataset.loaded)
            .slice(0, 6);

        if (photosToLoad.length === 0) {
            this.loadMoreBtn.style.display = 'none';
            return;
        }

        // Estado de carga
        this.loadMoreBtn.innerHTML = '<span>Cargando...</span>';
        this.loadMoreBtn.disabled = true;

        setTimeout(() => {
            photosToLoad.forEach((photo, index) => {
                photo.dataset.loaded = 'true';

                setTimeout(() => {
                    photo.classList.remove('hidden-photo');
                    photo.style.display = 'block';
                    photo.style.opacity = '0';
                    photo.style.transform = 'translateY(20px)';

                    setTimeout(() => {
                        photo.style.opacity = '1';
                        photo.style.transform = 'translateY(0)';
                        photo.style.transition = 'all 0.4s ease';
                    }, 100);

                }, index * 100);
            });

            // Restaurar botón
            this.loadMoreBtn.innerHTML = `
                <span>Cargar más fotos</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`;
            this.loadMoreBtn.disabled = false;

            this.checkLoadMoreButton();

        }, 800);
    }

    checkLoadMoreButton() {
        const remaining = Array.from(this.hiddenPhotos)
            .filter(photo => !photo.dataset.loaded).length;

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

        // Abrir lightbox al hacer clic en una foto
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

        // Cerrar con botón X
        closeBtn?.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        // Cerrar al hacer clic fuera de la imagen
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // Cerrar con tecla Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.taekwondoGallery = new TaekwondoGallery();
});
