/**
 * Universal Component Loader
 * Scans the DOM for "use:ComponentName" and replaces it with the component content.
 */

async function loadComponents() {
    const COMPONENT_DIR = 'modules/';
    const COMPONENT_EXT = '.html';

    // Helper to find text nodes containing "use:..."
    function findPlaceholders() {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const nodes = [];
        let node;
        while (node = walker.nextNode()) {
            const text = node.nodeValue.trim();
            if (text.startsWith('use:')) {
                nodes.push({
                    node: node,
                    componentName: text.replace('use:', '').trim()
                });
            }
        }
        return nodes;
    }

    const placeholders = findPlaceholders();

    // Unique components to fetch
    const uniqueComponents = [...new Set(placeholders.map(p => p.componentName))];

    // Fetch all needed components
    const templates = {};
    await Promise.all(uniqueComponents.map(async (name) => {
        try {
            const res = await fetch(`${COMPONENT_DIR}${name}${COMPONENT_EXT}`);
            if (res.ok) {
                templates[name] = await res.text();
            } else {
                console.error(`Failed to load component: ${name}`);
            }
        } catch (e) {
            console.error(`Error loading component ${name}:`, e);
        }
    }));

    // Replace placeholders
    // Process in reverse order of DOM to avoid invalidating references if we were modifying parent structure
    // (though replacing a text node's parent or the node itself is straightforward)

    for (const { node, componentName } of placeholders) {
        if (templates[componentName]) {
            const html = templates[componentName];

            // Create a temp container to parse HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            // Should we execute scripts in the component?
            // innerHTML does not execute scripts. We might need to manually handle them if needed.
            // For now, assuming static HTML or scripts handled globally.
            // Exception: Gallery_CardCarousel uses logic.
            // The previous logic was specific to Gallery. We need to unify.

            // If the component needs JS initialization, it should dispatch an event or be handled specifically.
            // For now, we just insert HTML.

            // The text node is likely inside a wrapper (e.g. <div>use:Header</div>) or just bare text.
            // If parent contains ONLY this text, replace parent. Otherwise replace text node.
            const parent = node.parentNode;

            // Check for specific initialization logic (like Gallery)
            if (componentName === 'Gallery_CardCarousel') {
                // Initialize gallery specific logic if needed, 
                // OR we rely on the component being just HTML and the logic runs globally?
                // The previous gallery_loader.js did everything. 
                // We should probably merge that logic or keep it specialized.
                // However, the previous approach was "find placeholder -> init".
                // Our new approach is also "find -> replace".
                // If we replace with HTML that contains the structure the JS expects, we can just run the initialization script after.
            }

            // Insert content
            const fragment = document.createDocumentFragment();

            // Helper to handle scripts
            function processNode(node) {
                if (node.tagName === 'SCRIPT') {
                    const newScript = document.createElement('script');
                    Array.from(node.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                    newScript.textContent = node.textContent;
                    return newScript;
                }
                return node;
            }

            // Move children to fragment, processing scripts
            // Note: We need to handle nested scripts if any. 
            // A simple way is to append everything, then find scripts in the DOM and re-insert them?
            // No, scripts inserted via innerHTML don't run. We must recreate them.
            // Walking the tempDiv is better.

            const scriptsToRun = [];

            // Recursive function to clone nodes and capture scripts
            function cloneAndCapture(node) {
                if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SCRIPT') {
                    const newScript = document.createElement('script');
                    Array.from(node.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                    newScript.textContent = node.textContent;
                    scriptsToRun.push(newScript);
                    // Return the new script element. When this is appended to the document, it should execute.
                    return newScript;
                }

                // For non-script elements or text nodes, clone them
                const clone = node.cloneNode(false); // shallow clone

                // If it's an element node, recurse through its children
                if (node.nodeType === Node.ELEMENT_NODE) {
                    let child = node.firstChild;
                    while (child) {
                        const processedChild = cloneAndCapture(child);
                        if (processedChild) {
                            clone.appendChild(processedChild);
                        }
                        child = child.nextSibling;
                    }
                }
                return clone;
            }

            let child = tempDiv.firstChild;
            while (child) {
                const processed = cloneAndCapture(child);
                fragment.appendChild(processed);
                child = child.nextSibling;
            }

            if (parent.childNodes.length === 1 && parent.childNodes[0] === node) {
                parent.replaceWith(fragment);
            } else {
                node.replaceWith(fragment);
            }
        }
    }

    // After all injections, dispatch an event for any JS that needs to run
    document.dispatchEvent(new Event('componentsLoaded'));
}

document.addEventListener('DOMContentLoaded', loadComponents);
