/**
 * Component Loader Script
 * Handles "use:Gallery_CardCarousel" replacement and rendering.
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Configuration
    const COMPONENT_NAME = 'Gallery_CardCarousel';
    const USE_SYNTAX = `use:${COMPONENT_NAME}`;
    
    // 1. Find the placeholder element containing the syntax
    // We look for elements that have the text content exactly matching, or specific container
    // For specific implementation, we search for a div with specific ID first for safety,
    // or scan DOM. To fit the requirement "use:Gallery_CardCarousel", we look for an element
    // acting as the placeholder.
    
    const placeholders = Array.from(document.querySelectorAll('*')).filter(el => 
        el.textContent.trim() === USE_SYNTAX && el.children.length === 0
    );

    if (placeholders.length === 0) {
        console.log(`[${COMPONENT_NAME}] No usage found.`);
        return;
    }

    console.log(`[${COMPONENT_NAME}] Found ${placeholders.length} placeholder(s). Initializing...`);

    try {
        // 2. Fetch resources
        const [htmlResponse, jsonResponse] = await Promise.all([
            fetch('modules/gallery_cardcarousel.html'),
            fetch('modules/gallery.json')
        ]);

        if (!htmlResponse.ok || !jsonResponse.ok) {
            throw new Error('Failed to load component resources');
        }

        const htmlTemplate = await htmlResponse.text();
        const data = await jsonResponse.json();

        // 3. Render for each placeholder
        placeholders.forEach(placeholder => {
            // Parse template
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlTemplate, 'text/html');
            const container = doc.querySelector('#gallery-container');
            const style = doc.querySelector('style');
            const cardTemplate = doc.querySelector('#gallery-card-template');
            
            if (!container || !cardTemplate) {
                console.error(`[${COMPONENT_NAME}] Invalid HTML template structure.`);
                return;
            }

            const track = container.querySelector('.gallery-track');

            // Apply settings
            if (data.settings && data.settings.duration) {
                track.style.setProperty('--gallery-duration', data.settings.duration);
            }

            // Create Items
            // For PC infinite loop effect, we duplicate the items enough times to fill width + buffer
            // Simple approach: Double the items for 50% translation loop
            
            const originalItems = data.items;
            // Ensure we have enough items for smooth loop (at least double)
            // If items are few, duplicate more
            let renderItems = [...originalItems, ...originalItems];
            if (originalItems.length < 5) {
                 renderItems = [...renderItems, ...originalItems, ...originalItems];
            }

            renderItems.forEach(item => {
                const clone = cardTemplate.content.cloneNode(true);
                const img = clone.querySelector('img');
                const card = clone.querySelector('.gallery-card');
                
                img.src = item.src;
                img.alt = item.alt;
                
                track.appendChild(clone);
            });

            // Add animation class for Desktop
            // Since we use Tailwind 'md:...' classes, we also need to add the animation class
            // But our CSS defines .gallery-track-animated inside media query
            track.classList.add('gallery-track-animated');

            // Inject Style if not already present in head
            if (style && !document.getElementById('gallery-component-style')) {
                style.id = 'gallery-component-style';
                document.head.appendChild(style);
            }

            // Replace placeholder with the new container
            placeholder.replaceWith(container);
        });

    } catch (error) {
        console.error(`[${COMPONENT_NAME}] Error loading component:`, error);
    }
});
