/**
 * Universal Component Loader & Parser Engine
 * Scans the DOM for "use:ComponentName" syntax and interprets it as an instruction to inject HTML modules.
 * 
 * Rules:
 * - Syntax: "use:ComponentName"
 * - Delimiter: Space or end of line
 * - Behavior: Replaces the syntax with the content of /modules/ComponentName.html
 * - Robustness: Ignores missing components but shows error placeholder. Handles multiple commands in one text node.
 */

async function parseAndLoadComponents() {
    // 1. FOUC Prevention: Hide content while parsing
    // Failsafe: Force opacity restoration after 3000ms
    const failsafeTimer = setTimeout(() => {
        document.body.style.opacity = '1';
        console.warn('[Component Loader] Failsafe triggered: Restoring body visibility due to timeout.');
    }, 3000);

    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.2s ease';

    // Relative Path Configuration
    // Works on both localhost and Cloudflare Pages (assuming root deployment)
    let MODULE_DIR = '/modules/';

    const MODULE_EXT = '.html';
    const USE_REGEX = /use:([^\s]+)/g; // Matches "use:Name" until whitespace

    // Helper: Collect all "commands" to process
    function collectCommands() {
        const textNodes = [];
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        let node;
        while (node = walker.nextNode()) {
            if (node.nodeValue.includes('use:')) {
                textNodes.push(node);
            }
        }

        const elements = [];
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            for (const attr of el.attributes) {
                if (attr.name.startsWith('use:')) {
                    elements.push({ element: el, attrName: attr.name });
                }
            }
        });

        return { textNodes, elements };
    }

    try {
        const { textNodes, elements } = collectCommands();
        if (textNodes.length === 0 && elements.length === 0) {
            return;
        }

        // 2. Identification: Find all unique component names
        const componentNames = new Set();
        textNodes.forEach(node => {
            const matches = [...node.nodeValue.matchAll(USE_REGEX)];
            matches.forEach(match => componentNames.add(match[1]));
        });
        elements.forEach(entry => {
            const name = entry.attrName.split(':')[1];
            if (name) componentNames.add(name);
        });

        // 3. Fetching: Load all required modules in parallel
        const moduleCache = {};
        await Promise.all([...componentNames].map(async (name) => {
            try {
                // Fetch using constructed path
                const response = await fetch(`${MODULE_DIR}${name}${MODULE_EXT}`);
                if (response.ok) {
                    moduleCache[name] = await response.text();
                } else {
                    console.warn(`[Component Loader] Component not found: "${name}" (Status: ${response.status})`);
                    // Improved fallback: visible error
                    moduleCache[name] = `<div style="color:red; font-weight:bold; border:1px solid red; background:#ffeeee; padding:4px;">[Missing component: ${name}]</div>`;
                }
            } catch (err) {
                console.warn(`[Component Loader] Error loading "${name}":`, err);
                moduleCache[name] = `<div style="color:red; font-weight:bold; border:1px solid red; background:#ffeeee; padding:4px;">[Error loading: ${name}]</div>`;
            }
        }));

        // 4. Expansion: Replace text syntax with HTML content
        for (const node of textNodes) {
            const text = node.nodeValue;
            let lastIndex = 0;
            const fragment = document.createDocumentFragment();
            let hasMatch = false;

            for (const match of text.matchAll(USE_REGEX)) {
                hasMatch = true;
                const componentName = match[1];
                const matchStart = match.index;
                const matchEnd = matchStart + match[0].length;

                if (matchStart > lastIndex) {
                    fragment.appendChild(document.createTextNode(text.slice(lastIndex, matchStart)));
                }

                let htmlContent = moduleCache[componentName];
                // Resolve placeholders from parent's data- attributes
                const parent = node.parentElement;
                if (htmlContent && parent) {
                    for (const attr of parent.attributes) {
                        if (attr.name.startsWith('data-')) {
                            const key = attr.name.slice(5).toUpperCase();
                            const val = attr.value;
                            htmlContent = htmlContent.replace(new RegExp(`{{${key}}}`, 'g'), val);
                        }
                    }
                }

                if (htmlContent) {
                    const temp = document.createElement('div');
                    temp.innerHTML = htmlContent;
                    Array.from(temp.childNodes).forEach(c => fragment.appendChild(createNodeWithExecutableScripts(c)));
                }
                lastIndex = matchEnd;
            }
            if (lastIndex < text.length) fragment.appendChild(document.createTextNode(text.slice(lastIndex)));

            if (hasMatch) {
                const p = node.parentNode;
                if (p && p.childNodes.length === 1 && p.firstChild === node && text.trim().match(/^use:[^\s]+$/)) {
                    p.replaceWith(fragment);
                } else {
                    node.replaceWith(fragment);
                }
            }
        }

        // 5. Expansion: Process Element-based commands
        for (const entry of elements) {
            const componentName = entry.attrName.split(':')[1];
            let htmlContent = moduleCache[componentName];
            if (htmlContent) {
                // Resolve placeholders from attributes of THIS element
                for (const attr of entry.element.attributes) {
                    if (attr.name.startsWith('data-')) {
                        const key = attr.name.slice(5).toUpperCase();
                        const val = attr.value;
                        htmlContent = htmlContent.replace(new RegExp(`{{${key}}}`, 'g'), val);
                    }
                }
                const temp = document.createElement('div');
                temp.innerHTML = htmlContent;
                const frag = document.createDocumentFragment();
                Array.from(temp.childNodes).forEach(c => frag.appendChild(createNodeWithExecutableScripts(c)));
                entry.element.replaceWith(frag);
            }
        }

        document.dispatchEvent(new CustomEvent('componentsReady'));
    } catch (e) {
        console.error('[Component Loader] Critical Error:', e);
    } finally {
        clearTimeout(failsafeTimer);
        document.body.style.opacity = '1';
    }
}

/**
 * Deep clones a node, recreating <script> tags so they become executable.
 */
function createNodeWithExecutableScripts(node) {
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SCRIPT') {
        const newScript = document.createElement('script');
        Array.from(node.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
        newScript.textContent = node.textContent;
        return newScript;
    }

    // For other nodes, clone and recurse
    const clone = node.cloneNode(false);
    if (node.nodeType === Node.ELEMENT_NODE) {
        let child = node.firstChild;
        while (child) {
            clone.appendChild(createNodeWithExecutableScripts(child));
            child = child.nextSibling;
        }
    }
    return clone;
}

// Init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', parseAndLoadComponents);
} else {
    parseAndLoadComponents();
}
