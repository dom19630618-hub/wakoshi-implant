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

    // Absolute Path Configuration
    // Uses window.location.origin to ensure absolute path from root, vital for Cloudflare Pages.
    // Note: On file:// protocol, this results in file:///modules/ which assumes modules is at system root.
    // If running locally without a server, use a local server like 'Live Server' or 'wrangler dev'.
    // Force localhost path as per user request to avoid file:// misinterpretation
    let MODULE_DIR = 'http://localhost:3000/modules/';

    // Fallback for file:// protocol if strictly needed (automagic fix)
    // If strict compliance to user request is needed, removing this check is an option,
    // but this ensures "always works" on file:// as requested.
    if (window.location.protocol === 'file:') {
        // For file protocol, we must use relative path assuming index.html is sibling to modules folder.
        MODULE_DIR = 'modules/';
    }

    const MODULE_EXT = '.html';
    const USE_REGEX = /use:([^\s]+)/g; // Matches "use:Name" until whitespace

    // Helper: Collect all text nodes that *might* contain the syntax
    function collectCandidateNodes() {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        const nodes = [];
        let node;
        while (node = walker.nextNode()) {
            if (node.nodeValue.includes('use:')) {
                nodes.push(node);
            }
        }
        return nodes;
    }

    try {
        const textNodes = collectCandidateNodes();
        if (textNodes.length === 0) {
            // No work to do
            return;
        }

        // 2. Identification: Find all unique component names
        const componentNames = new Set();
        textNodes.forEach(node => {
            const matches = [...node.nodeValue.matchAll(USE_REGEX)];
            matches.forEach(match => componentNames.add(match[1]));
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

        // 4. Expansion: Replace syntax with HTML content
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

                // Append preceding text
                if (matchStart > lastIndex) {
                    fragment.appendChild(document.createTextNode(text.slice(lastIndex, matchStart)));
                }

                // Append Component HTML or Fallback
                const htmlContent = moduleCache[componentName];
                // Always truthy now due to fallback string
                if (htmlContent) {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = htmlContent;

                    Array.from(tempDiv.childNodes).forEach(child => {
                        const processed = createNodeWithExecutableScripts(child);
                        fragment.appendChild(processed);
                    });
                }

                lastIndex = matchEnd;
            }

            // Append remaining text
            if (lastIndex < text.length) {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
            }

            if (hasMatch) {
                const parent = node.parentNode;
                const isOnlyChild = parent.childNodes.length === 1 && parent.firstChild === node;

                if (isOnlyChild && text.trim().match(/^use:[^\s]+$/)) {
                    parent.replaceWith(fragment);
                } else {
                    node.replaceWith(fragment);
                }
            }
        }

        document.dispatchEvent(new CustomEvent('componentsReady'));

    } catch (e) {
        console.error('[Component Loader] Critical Error:', e);
    } finally {
        // Force opacity restoration synchronously
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
