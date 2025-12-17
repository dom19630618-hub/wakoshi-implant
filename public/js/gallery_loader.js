/**
 * Component Loader Script
 * Handles "use:Gallery_CardCarousel" replacement and rendering.
 */

document.addEventListener('componentsReady', async () => {
    // Configuration
    const COMPONENT_NAME = 'Gallery_CardCarousel';
    const USE_SYNTAX = `use:${COMPONENT_NAME}`;

    // 1. Find the placeholder element containing the syntax
    // We look for elements that have the text content exactly matching, or specific container
    // For specific implementation, we search for a div with specific ID first for safety,
    // or scan DOM. To fit the requirement "use:Gallery_CardCarousel", we look for an element
    // acting as the placeholder.

    // 1. Find the already injected container (Hydration mode)
    // Since component_loader.js runs first, it should have already injected the HTML structure.
    const container = document.getElementById('gallery-container');

    if (!container) {
        console.log(`[${COMPONENT_NAME}] No container found (#gallery-container). Skipping.`);
        return;
    }

    // Check if already initialized (to prevent double-init if called multiple times)
    if (container.classList.contains('gallery-initialized')) {
        return;
    }

    console.log(`[${COMPONENT_NAME}] Container found. Initializing...`);

    try {
        // 2. Fetch data only (HTML is already there)
        const jsonResponse = await fetch('modules/gallery.json');

        if (!jsonResponse.ok) {
            throw new Error('Failed to load gallery data');
        }

        const data = await jsonResponse.json();

        // 3. Hydrate the component
        const track = container.querySelector('.gallery-track');
        // Template should be inside the container as per gallery_cardcarousel.html structure
        const cardTemplate = document.getElementById('gallery-card-template');



        if (!track || !cardTemplate) {
            console.error(`[${COMPONENT_NAME}] Invalid HTML structure: missing track or template.`);
            console.error("track:", track, "template:", cardTemplate);
            return;
        }



        // Apply settings
        if (data.settings && data.settings.duration) {
            track.style.setProperty('--gallery-duration', data.settings.duration);
        }

        // Create Items
        // For PC infinite loop effect
        const originalItems = data.items;
        let renderItems = [...originalItems, ...originalItems];
        if (originalItems.length < 5) {
            renderItems = [...renderItems, ...originalItems, ...originalItems];
        }

        renderItems.forEach(item => {
            const clone = cardTemplate.content.cloneNode(true);
            const img = clone.querySelector('img');

            if (img) {
                img.src = item.src;
                img.alt = item.alt;
            }

            track.appendChild(clone);
            track.style.width = track.scrollWidth + 'px';
        });

        // Initialize Advanced Auto Scroll with User Interaction Support (Robust)
        const initAutoScrollGallery = (track, opts = {}) => {
            const speed = opts.speed ?? 0.5;
            const resumeDelay = 2000;

            // Infinite loop setup
            if (!track.dataset.looped) {
                const children = Array.from(track.children);
                children.forEach(el => track.appendChild(el.cloneNode(true)));
                track.dataset.looped = "1";
            }

            let rafId = null;
            let isPaused = false;
            let resumeTimer = null;
            let isPointerDown = false;

            // Define control functions
            const stopAutoScroll = () => {
                isPaused = true;
                if (rafId) cancelAnimationFrame(rafId);
                rafId = null;
                if (resumeTimer) clearTimeout(resumeTimer);
                resumeTimer = null;
            };

            const startAutoScroll = () => {
                stopAutoScroll(); // Clear previous state
                isPaused = false;
                tick();
            };

            const resumeAutoScroll = () => {
                if (resumeTimer) clearTimeout(resumeTimer);
                resumeTimer = setTimeout(() => {
                    if (!isPointerDown) {
                        startAutoScroll();
                    }
                }, resumeDelay);
            };

            const tick = () => {
                if (isPaused || isPointerDown) return;

                const half = track.scrollWidth / 2;
                if (track.scrollLeft >= half) {
                    track.scrollLeft -= half;
                } else if (track.scrollLeft <= 0) {
                    track.scrollLeft += half;
                }

                track.scrollLeft += speed;
                rafId = requestAnimationFrame(tick);
            };

            // Interaction Handlers
            const onInteraction = () => {
                stopAutoScroll();
                resumeAutoScroll();
            };

            // Event Listeners
            track.addEventListener("touchstart", () => { isPointerDown = true; onInteraction(); }, { passive: true });
            track.addEventListener("touchend", () => { isPointerDown = false; onInteraction(); }, { passive: true });
            track.addEventListener("touchcancel", () => { isPointerDown = false; onInteraction(); }, { passive: true });
            track.addEventListener("wheel", onInteraction, { passive: true });

            // Critical fix: Only treat scroll as interaction if we are already paused or user is holding 
            // (prevents auto-scroll from pausing itself)
            track.addEventListener("scroll", () => {
                if (isPaused || isPointerDown) {
                    onInteraction();
                }
            }, { passive: true });

            // PC Drag Logic
            let startX = 0;
            let startScrollLeft = 0;

            track.addEventListener("pointerdown", (e) => {
                isPointerDown = true;
                track.setPointerCapture?.(e.pointerId);
                startX = e.clientX;
                startScrollLeft = track.scrollLeft;
                track.style.cursor = 'grabbing';
                onInteraction();
            });

            track.addEventListener("pointermove", (e) => {
                if (!isPointerDown) return;
                onInteraction();
                const dx = e.clientX - startX;
                track.scrollLeft = startScrollLeft - dx;
            });

            const pointerUp = () => {
                if (!isPointerDown) return;
                isPointerDown = false;
                track.style.cursor = 'grab';
                onInteraction();
            };
            track.addEventListener("pointerup", pointerUp);
            track.addEventListener("pointercancel", pointerUp);
            track.addEventListener("pointerleave", pointerUp);

            // Mandatory Start
            startAutoScroll();
        };

        initAutoScrollGallery(track);

        // Remove CSS animation if previously added
        track.classList.remove('gallery-track-animated');

        // Mark as initialized
        console.log(`[${COMPONENT_NAME}] Hydration successful. Cards rendered.`);
        container.classList.add('gallery-initialized');

    } catch (error) {
        console.error(`[${COMPONENT_NAME}] Error loading component:`, error);
    }
});
