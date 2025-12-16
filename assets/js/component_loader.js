/**
 * Universal Component Loader
 * Scans the DOM for "use:ComponentName" and replaces it with the component content.
 * Prevents "use:..." text from being visible by managing body opacity.
 */

async function loadComponents() {
    // Prevent FOUC (Flash of Unstyled Content) / Raw text display
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';

    const COMPONENT_DIR = 'modules/';
    const COMPONENT_EXT = '.html';

    // Helper to find nodes containing "use:..."
    // We search text nodes.
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
            // Match strict "use:Name" allowing for surrounding whitespace in the node
            // But we only care if the node essentially JUST contains this command
            if (text.startsWith('use:')) {
                nodes.push({
                    node: node,
                    componentName: text.replace('use:', '').trim()
                });
            }
        }
        return nodes;
    }

    try {
        const placeholders = findPlaceholders();

        // Unique components to fetch
        const uniqueComponents = [...new Set(placeholders.map(p => p.componentName))];

        // Fetch all needed components
        const templates = {};
        await Promise.all(uniqueComponents.map(async (name) => {
            try {
                // Try fetching exactly as named (Case sensitive usually on server, assuming user matches case)
                const res = await fetch(`${COMPONENT_DIR}${name}${COMPONENT_EXT}`);
                if (res.ok) {
                    templates[name] = await res.text();
                } else {
                    console.error(`Failed to load component: ${name} (404)`);
                }
            } catch (e) {
                console.error(`Error loading component ${name}:`, e);
            }
        }));

        // Replace placeholders
        for (const { node, componentName } of placeholders) {
            if (templates[componentName]) {
                const html = templates[componentName];

                // Create a temp container to parse HTML
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;

                const fragment = document.createDocumentFragment();

                // Recursive function to clone nodes and capture/recreate scripts
                function cloneAndCapture(node) {
                    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SCRIPT') {
                        const newScript = document.createElement('script');
                        Array.from(node.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
                        newScript.textContent = node.textContent;
                        return newScript;
                    }

                    const clone = node.cloneNode(false);
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

                // If the text node is the only child of its parent (e.g. <div>use:Header</div>),
                // replace the parent to remove the wrapper.
                // Otherwise just replace the text node.
                const parent = node.parentNode;
                if (parent.childNodes.length === 1) {
                    parent.replaceWith(fragment);
                } else {
                    node.replaceWith(fragment);
                }
            }
        }

        // Fire event
        document.dispatchEvent(new Event('componentsLoaded'));

    } catch (e) {
        console.error('Component loading process failed:', e);
    } finally {
        // Show body content
        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });
    }
}

// Start loading as soon as DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadComponents);
} else {
    loadComponents();
}
