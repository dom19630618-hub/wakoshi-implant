/**
 * Universal Component Loader & Parser Engine
 * Scans the DOM for "use:ComponentName" syntax and interprets it as an instruction to inject HTML modules.
 * 
 * Rules:
 * - Syntax: "use:ComponentName"
 * - Delimiter: Space or end of line
 * - Behavior: Replaces the syntax with the content of /modules/ComponentName.html
 * - Robustness: Ignores missing components safely. Handles multiple commands in one text node.
 */

async function parseAndLoadComponents() {
    // 1. FOUC Prevention: Hide content while parsing
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.2s ease';

    const MODULE_DIR = 'modules/';
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
            // Reset regex state just in case, though matchAll creates new iterator
            const matches = [...node.nodeValue.matchAll(USE_REGEX)];
            matches.forEach(match => componentNames.add(match[1]));
        });

        // 3. Fetching: Load all required modules in parallel
        const moduleCache = {};
        await Promise.all([...componentNames].map(async (name) => {
            try {
                // Determine path. Assuming relative to root or current path.
                // Since this runs on index.html, relative path 'modules/' works.
                const response = await fetch(`${MODULE_DIR}${name}${MODULE_EXT}`);
                if (response.ok) {
                    moduleCache[name] = await response.text();
                } else {
                    console.warn(`[Component Loader] Module not found: ${name} (Ignored)`);
                    moduleCache[name] = null; // Mark as missing
                }
            } catch (err) {
                console.warn(`[Component Loader] Failed to fetch ${name}`, err);
                moduleCache[name] = null;
            }
        }));

        // 4. Expansion: Replace syntax with HTML content
        // We process nodes. Since replacing a node allows us to insert multiple nodes (fragment),
        // we can handle "Text use:A Text use:B" by splitting the text node.

        for (const node of textNodes) {
            const text = node.nodeValue;
            let lastIndex = 0;
            const fragment = document.createDocumentFragment();
            let hasMatch = false;

            // We iterate manually to construct the replacement fragment
            // matchAll works well here
            for (const match of text.matchAll(USE_REGEX)) {
                hasMatch = true;
                const componentName = match[1];
                const matchStart = match.index;
                const matchEnd = matchStart + match[0].length;

                // Append preceding text if any
                if (matchStart > lastIndex) {
                    fragment.appendChild(document.createTextNode(text.slice(lastIndex, matchStart)));
                }

                // Append Component HTML
                const htmlContent = moduleCache[componentName];
                if (htmlContent) {
                    // Convert HTML string to DOM nodes
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = htmlContent;

                    // Move children to fragment
                    // NOTE: A simpler approach for script execution is to create Range contexts 
                    // or just classic cloning with manual script recreation.
                    Array.from(tempDiv.childNodes).forEach(child => {
                        // We need deep cloning that handles Scripts specially
                        // Using a helper function that recreates scripts
                        const processed = createNodeWithExecutableScripts(child);
                        fragment.appendChild(processed);
                    });
                } else {
                    // Component not found: insert nothing (effectively deleting the command)
                    // Optionally insert a comment for debugging
                    // fragment.appendChild(document.createComment(` Missing: ${componentName} `));
                }

                lastIndex = matchEnd;
            }

            // Append remaining text
            if (lastIndex < text.length) {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
            }

            if (hasMatch) {
                // 5. Finalize Replacement
                // If the regex matched strictly the whole content of a wrapper element (like <div>use:A</div>),
                // and the text node was the ONLY child, we might want to unwrap it.
                // But the user requested "Detect text and insert HTML". 
                // Replacing the text node is the safest atomic operation.

                // Optimization: If parent is a container just for this command (e.g. <p>use:Hero</p>),
                // we might leave an empty <p></p> or a <p><div>hero...</div></p> which is invalid depending on hero content.
                // If the inserted content is Block level, and parent is P, browser might close P early.
                // To be safe, if the text node comprises the ENTIRE content of its parent, replace the parent.

                const parent = node.parentNode;
                const isOnlyChild = parent.childNodes.length === 1 && parent.firstChild === node;
                const isFullMatch = lastIndex === text.length && lastIndex === text.trim().length && node.nodeValue.trim().startsWith('use:');
                // The above check is tricky because text might contain whitespace.

                if (isOnlyChild && text.trim().match(/^use:[^\s]+$/)) {
                    // Pure replacement case: <div>use:Hero</div> -> Hero content
                    parent.replaceWith(fragment);
                } else {
                    // Inline replacement or mixed content: <span>Check this: use:Button</span>
                    node.replaceWith(fragment);
                }
            }
        }

        // Notify system
        document.dispatchEvent(new Event('componentsLoaded'));

    } catch (e) {
        console.error('[Component Loader] Critical Error:', e);
    } finally {
        // Reveal Body
        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });
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
