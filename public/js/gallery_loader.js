/**
 * Gallery Loader Script with Lightbox & Smooth Swiping
 * Handles loading items from gallery.json, infinite autoscroll, and swipe to zoom.
 */

document.addEventListener('componentsReady', async () => {
    const COMPONENT_NAME = 'Gallery_CardCarousel';
    const container = document.getElementById('gallery-container');

    if (!container) {
        console.log(`[${COMPONENT_NAME}] No container found. Skipping.`);
        return;
    }

    if (container.classList.contains('gallery-initialized')) {
        return;
    }

    console.log(`[${COMPONENT_NAME}] Initializing...`);

    // 1. Inject Lightbox HTML to body if it doesn't exist
    let lightbox = document.getElementById('gallery-lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'gallery-lightbox';
        lightbox.className = 'gallery-lightbox';
        lightbox.innerHTML = `
            <span class="gallery-lightbox__close">&times;</span>
            <img class="gallery-lightbox__content" id="gallery-lightbox-img" alt="">
            <div class="gallery-lightbox__caption" id="gallery-lightbox-caption"></div>
        `;
        document.body.appendChild(lightbox);
    }

    const lightboxImg = document.getElementById('gallery-lightbox-img');
    const lightboxCaption = document.getElementById('gallery-lightbox-caption');
    const lightboxClose = lightbox.querySelector('.gallery-lightbox__close');

    try {
        // 2. Fetch data
        const jsonResponse = await fetch('modules/gallery.json');
        if (!jsonResponse.ok) throw new Error('Failed to load gallery data');
        const data = await jsonResponse.json();

        const track = container.querySelector('.gallery-track');
        const cardTemplate = document.getElementById('gallery-card-template');

        if (!track || !cardTemplate) {
            console.error(`[${COMPONENT_NAME}] Invalid HTML structure.`);
            return;
        }

        // Duplicate items to ensure infinite loop works smoothly
        const originalItems = data.items;
        // Repeat originalItems enough times to fill screen width multiple times
        let renderItems = [...originalItems, ...originalItems, ...originalItems];

        // Create cards and add click event for Lightbox
        renderItems.forEach(item => {
            const clone = cardTemplate.content.cloneNode(true);
            const card = clone.querySelector('.gallery-card');
            const img = clone.querySelector('img');

            if (img) {
                img.src = item.src;
                img.alt = item.alt;
            }

            // Click to zoom
            if (card) {
                card.addEventListener('click', () => {
                    openLightbox(item.src, item.alt);
                });
            }

            track.appendChild(clone);
        });

        // Loop Control Variables
        let speed = 0.4; // Slowly slide
        let rafId = null;
        let isPaused = false;
        let isLightboxOpen = false;
        let resumeTimer = null;
        let isInteracting = false;

        const tick = () => {
            if (isPaused || isInteracting || isLightboxOpen) return;

            // Half width infinite loop shift
            const maxScroll = track.scrollWidth - track.clientWidth;
            if (track.scrollLeft >= maxScroll / 2) {
                track.scrollLeft = 0;
            }

            track.scrollLeft += speed;
            rafId = requestAnimationFrame(tick);
        };

        const startAutoScroll = () => {
            isPaused = false;
            if (!rafId) {
                tick();
            }
        };

        const stopAutoScroll = () => {
            isPaused = true;
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        };

        const pauseForInteraction = () => {
            isInteracting = true;
            stopAutoScroll();
            if (resumeTimer) clearTimeout(resumeTimer);
            
            // Resume autoscroll after 3 seconds of no interaction
            resumeTimer = setTimeout(() => {
                isInteracting = false;
                startAutoScroll();
            }, 3000);
        };

        // Swipe & Native Scroll handling
        track.addEventListener('scroll', () => {
            // Check if scroll limit is reached, loop to start
            const maxScroll = track.scrollWidth - track.clientWidth;
            if (track.scrollLeft >= maxScroll - 5) {
                track.scrollLeft = 10;
            } else if (track.scrollLeft <= 0) {
                track.scrollLeft = maxScroll / 2;
            }
        }, { passive: true });

        // Touch/Pointer interactions to temporarily pause autoscroll
        track.addEventListener('touchstart', pauseForInteraction, { passive: true });
        track.addEventListener('touchmove', pauseForInteraction, { passive: true });
        track.addEventListener('mousedown', pauseForInteraction, { passive: true });
        track.addEventListener('mousemove', (e) => {
            if (e.buttons > 0) { // dragging
                pauseForInteraction();
            }
        }, { passive: true });

        // Lightbox Functions
        const openLightbox = (src, alt) => {
            isLightboxOpen = true;
            stopAutoScroll();
            lightboxImg.src = src;
            lightboxCaption.textContent = alt || '';
            lightbox.classList.add('is-open');
            document.body.style.overflow = 'hidden'; // prevent bg scrolling
        };

        const closeLightbox = () => {
            isLightboxOpen = false;
            lightbox.classList.remove('is-open');
            document.body.style.overflow = '';
            lightboxImg.src = '';
            startAutoScroll();
        };

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === lightboxImg) {
                closeLightbox();
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isLightboxOpen) {
                closeLightbox();
            }
        });

        // Initialize autoscroll
        startAutoScroll();

        console.log(`[${COMPONENT_NAME}] Initialization successful.`);
        container.classList.add('gallery-initialized');

    } catch (error) {
        console.error(`[${COMPONENT_NAME}] Error loading component:`, error);
    }
});

