document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    // 1. Mobile Menu Toggle
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // 2. Smooth Scrolling for Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Offset by header height
                    behavior: 'smooth'
                });
                // Close mobile menu after click
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // 3. Fade-in on Scroll Animation
    const fadeElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, observerOptions);

    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // 4. Gallery Filter Functionality
    const galleryFilters = document.querySelectorAll('.gallery-filter');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (galleryFilters.length > 0 && galleryItems.length > 0) {
        galleryFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                // Remove active class and reset styles from all filters
                galleryFilters.forEach(f => {
                    f.classList.remove('active');
                    f.classList.remove('bg-blue-500', 'text-white');
                    f.classList.add('bg-gray-800', 'text-gray-300');
                });
                
                // Add active class and styles to clicked filter
                filter.classList.add('active');
                filter.classList.remove('bg-gray-800', 'text-gray-300');
                filter.classList.add('bg-blue-500', 'text-white');
                
                const filterValue = filter.getAttribute('data-filter');
                
                // Filter gallery items with smooth animation
                galleryItems.forEach((item, index) => {
                    const itemCategory = item.getAttribute('data-category');
                    
                    if (filterValue === 'all' || itemCategory === filterValue) {
                        // Show item with fade-in animation
                        item.style.display = '';
                        item.style.opacity = '0';
                        setTimeout(() => {
                            item.style.transition = 'opacity 0.3s ease-in';
                            item.style.opacity = '1';
                            item.classList.remove('hidden');
                        }, index * 50);
                    } else {
                        // Hide item with fade-out animation
                        item.style.transition = 'opacity 0.3s ease-out';
                        item.style.opacity = '0';
                        setTimeout(() => {
                            item.style.display = 'none';
                            item.classList.add('hidden');
                        }, 300);
                    }
                });
            });
        });
    }

    // 5. Gallery Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const closeLightbox = document.getElementById('closeLightbox');
    const prevImageBtn = document.getElementById('prevImage');
    const nextImageBtn = document.getElementById('nextImage');
    const galleryImages = document.querySelectorAll('.gallery-item img');
    
    let currentImageIndex = 0;
    const visibleImages = Array.from(galleryImages);

    function openLightbox(index) {
        currentImageIndex = index;
        lightboxImage.src = visibleImages[index].src;
        lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeLightboxFunc() {
        lightbox.classList.add('hidden');
        document.body.style.overflow = '';
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
        lightboxImage.src = visibleImages[currentImageIndex].src;
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
        lightboxImage.src = visibleImages[currentImageIndex].src;
    }

    // Open lightbox on image click
    galleryImages.forEach((img, index) => {
        img.parentElement.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    // Close lightbox
    if (closeLightbox) {
        closeLightbox.addEventListener('click', closeLightboxFunc);
    }

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightboxFunc();
        }
    });

    // Navigation buttons
    if (nextImageBtn) {
        nextImageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showNextImage();
        });
    }

    if (prevImageBtn) {
        prevImageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showPrevImage();
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('hidden')) {
            if (e.key === 'Escape') {
                closeLightboxFunc();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            }
        }
    });
});