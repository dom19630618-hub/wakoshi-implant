/**
 * Component Loader Script
 * Handles "use:Gallery_CardCarousel" replacement and rendering.
 */

console.log("[gallery_loader] loaded");
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
        const jsonResponse = await fetch('/modules/gallery.json');

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
        });

        // Add animation class
        track.classList.add('gallery-track-animated');

        // Mark as initialized
        container.classList.add('gallery-initialized');

    } catch (error) {
        console.error(`[${COMPONENT_NAME}] Error loading component:`, error);
    }
});
