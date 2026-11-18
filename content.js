(async function() {
    'use strict';

    const domain = window.location.hostname;
    try {
        const settings = await chrome.storage.local.get(domain);
        const css = await resolveReadingStyles(settings[domain]);
        if (!css) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'css-domain-modifier-styles';
        style.textContent = css;
        document.head.appendChild(style);
    } catch (error) {
        console.error('Nacion.com Modifier: Error applying saved styles:', error);
    }
})();
