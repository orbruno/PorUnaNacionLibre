document.addEventListener('DOMContentLoaded', async function() {
    const cssInput = document.getElementById('cssInput');
    const applyBtn = document.getElementById('applyBtn');
    const removeBtn = document.getElementById('removeBtn');
    const resetBtn = document.getElementById('resetBtn');
    const statusDiv = document.getElementById('status');
    const currentDomainDiv = document.getElementById('currentDomain');
    const domainStatusDiv = document.getElementById('domainStatus');
    const controls = [cssInput, applyBtn, removeBtn, resetBtn];

    let currentTab;
    let currentDomain;

    setControlsDisabled(true);
    try {
        [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (currentTab?.id == null || !currentTab.url) {
            currentDomainDiv.textContent = '';
            showStatus('No active web page found.', 'error');
            return;
        }

        const url = new URL(currentTab.url);
        currentDomain = url.hostname;
        currentDomainDiv.textContent = currentDomain;
        const supportedProtocol = url.protocol === 'https:' || url.protocol === 'http:';
        const supportedDomain = currentDomain === 'nacion.com' || currentDomain.endsWith('.nacion.com');
        if (!supportedProtocol || !supportedDomain) {
            showStatus('Open a page on nacion.com to use this extension.', 'error');
            return;
        }

        const settings = await chrome.storage.local.get(currentDomain);
        const savedCSS = await resolveReadingStyles(settings[currentDomain]);
        cssInput.value = savedCSS || NACION_CSS;
        showEnabledState(Boolean(savedCSS));
        setControlsDisabled(false);
    } catch (error) {
        console.error('Error loading extension settings:', error);
        showStatus('Could not load the extension settings.', 'error');
        return;
    }

    applyBtn.addEventListener('click', async function() {
        const css = cssInput.value.trim();
        if (!css) {
            showStatus('Enter CSS before applying the reading styles.', 'error');
            return;
        }
        await changeStyles(css);
    });

    removeBtn.addEventListener('click', () => changeStyles(null));
    resetBtn.addEventListener('click', async function() {
        setControlsDisabled(true);
        await reloadPage('Could not reload this tab.');
        setControlsDisabled(false);
    });

    async function changeStyles(css) {
        setControlsDisabled(true);
        try {
            if (css === null) {
                await chrome.storage.local.remove(currentDomain);
                cssInput.value = NACION_CSS;
            } else {
                await chrome.storage.local.set({ [currentDomain]: css === NACION_CSS ? true : css });
            }
            showEnabledState(css !== null);
            await reloadPage('Settings saved. Refresh the page to apply them.');
        } catch (error) {
            console.error('Error saving extension settings:', error);
            showStatus('Could not save the extension settings.', 'error');
        } finally {
            setControlsDisabled(false);
        }
    }

    async function reloadPage(errorMessage) {
        try {
            await chrome.tabs.reload(currentTab.id);
            window.close();
        } catch (error) {
            console.error('Error reloading page:', error);
            showStatus(errorMessage, 'error');
        }
    }

    function setControlsDisabled(disabled) {
        for (const control of controls) {
            control.disabled = disabled;
        }
    }

    function showEnabledState(enabled) {
        domainStatusDiv.textContent = enabled ? 'Reading styles enabled' : 'Reading styles disabled';
        domainStatusDiv.style.color = enabled ? '#2e7d32' : '#555';
    }

    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = `status ${type}`;
    }
});
