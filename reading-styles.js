const NACION_CSS = `.article-body-wrapper__styled {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
}

.tp-modal,
.tp-backdrop.tp-active,
.gnad-container,
iframe[src^="https://news.google.com/swg/ui/v1/serviceiframe?"] {
    display: none !important;
}

html:has(> body.tp-modal-open),
body.tp-modal-open {
    overflow: auto !important;
    height: auto !important;
}

body.tp-modal-open {
    position: static !important;
}`;

async function resolveReadingStyles(saved) {
    if (saved === true) {
        return NACION_CSS;
    }
    if (typeof saved !== 'string' || !saved.trim()) {
        return '';
    }

    // Version 1.1 stored a copy of the default rules in the same format as custom CSS.
    // Identify that exact preset so changes to it count as custom CSS.
    const css = saved.trim();
    if (css.length === 2049 && globalThis.crypto?.subtle) {
        const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(css));
        const hash = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
        if (hash === '9f2d6636edd412fe442278778ea8fa453b95badadd186a86e68e609569469e1d') {
            return NACION_CSS;
        }
    }
    return saved;
}
