// popup.js - Handles the extension popup functionality

// The specific CSS to apply to nacion.com
const NACION_CSS = `.tp-modal {
  display: none !important;
  opacity: unset !important;
}

.default-offer {
    display: none !important;
}

.gnad-container {
    display: none !important;
}

.tp-backdrop.tp-active {
  display: none !important
}

[class^="default__DivComponent"] {
  /* Your styles here */
  visibility: visible !important;
}

.article-body-wrapper__styled {
  display: block !important;
}

[view="offer"] {
  display: none !important;
}

#view-offer {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
  position: absolute !important;
  left: -9999px !important;
  pointer-events: none !important;
}

/* Additional targeting for dynamic elements */
[id="view-offer"],
*[id^="view-offer"],
div#view-offer,
.view-offer,
[class*="view-offer"] {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  height: 0 !important;
  overflow: hidden !important;
  position: absolute !important;
  left: -9999px !important;
  pointer-events: none !important;
}

/* Re-enable page scrolling during QA */
html, body {
  overflow: auto !important;
  height: auto !important;
}

/* Piano / modal patterns that lock scroll */
body.tp-modal-open,
body.tp-scroll-lock,
body.modal-open {
  overflow: auto !important;
  position: static !important;   /* undo fixed locking */
}

/* If the page wrapper is also locked */
#fusion-app, .page-wrapper, .content-wrapper {
  position: static !important;
  height: auto !important;
  overflow: visible !important;
}

[class="article-body-wrapper__styled"] {
  display: unset !important;
  opacity: unset !important;
}

.default__DivComponent-sc-oqc75h-3  {
  opacity: unset !important;
}

.checkout .view-show {
    display: none !important;
}`;

document.addEventListener('DOMContentLoaded', async function() {
    const cssInput = document.getElementById('cssInput');
    const applyBtn = document.getElementById('applyBtn');
    const removeBtn = document.getElementById('removeBtn');
    const resetBtn = document.getElementById('resetBtn');
    const statusDiv = document.getElementById('status');
    const currentDomainDiv = document.getElementById('currentDomain');
    const domainStatusDiv = document.getElementById('domainStatus');

    let currentTab = null;
    let currentDomain = '';

    // Get current tab and domain
    try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        currentTab = tabs[0];
        
        if (currentTab && currentTab.url) {
            const url = new URL(currentTab.url);
            currentDomain = url.hostname;
            currentDomainDiv.textContent = currentDomain;
            
            // Check if we're on nacion.com
            if (!currentDomain.includes('nacion.com')) {
                showStatus('This extension only works on nacion.com', 'error');
                applyBtn.disabled = true;
                removeBtn.disabled = true;
                return;
            }
            
            // Set the CSS content
            cssInput.value = NACION_CSS;
            
            // Load existing CSS for this domain
            await loadExistingCSS();
        } else {
            showStatus('Unable to get current tab information', 'error');
        }
    } catch (error) {
        console.error('Error getting current tab:', error);
        showStatus('Error: Unable to access current tab', 'error');
    }

    // Load existing CSS for the current domain
    async function loadExistingCSS() {
        try {
            const result = await chrome.storage.local.get([currentDomain]);
            if (result[currentDomain]) {
                cssInput.value = NACION_CSS; // Always show the correct CSS
                domainStatusDiv.textContent = '✓ Paywall removed';
                domainStatusDiv.style.color = '#4CAF50';
            } else {
                domainStatusDiv.textContent = 'Paywall active';
                domainStatusDiv.style.color = '#f44336';
            }
        } catch (error) {
            console.error('Error loading existing CSS:', error);
        }
    }

    // Apply CSS button
    applyBtn.addEventListener('click', async function() {
        const cssCode = NACION_CSS;
        
        if (!currentTab) {
            showStatus('No active tab found', 'error');
            return;
        }

        if (!currentDomain.includes('nacion.com')) {
            showStatus('This extension only works on nacion.com', 'error');
            return;
        }

        try {
            // Save CSS to storage
            await chrome.storage.local.set({ [currentDomain]: cssCode });
            
            // Inject CSS into the current tab
            await chrome.scripting.insertCSS({
                target: { tabId: currentTab.id },
                css: cssCode
            });
            
            // Try to send message to content script, but don't fail if it doesn't respond
            try {
                await chrome.tabs.sendMessage(currentTab.id, {
                    action: 'applyCSS',
                    css: cssCode,
                    domain: currentDomain
                });
            } catch (messageError) {
                // Content script might not be ready, but that's OK - CSS is already injected
                console.log('Content script not responding, but CSS was injected successfully');
            }
            
            showStatus('Paywall removed! Refreshing page...', 'success');
            domainStatusDiv.textContent = '✓ Paywall removed';
            domainStatusDiv.style.color = '#4CAF50';
            
            // Refresh the page automatically after applying CSS
            setTimeout(async () => {
                try {
                    await chrome.tabs.reload(currentTab.id);
                    // Close popup after reload
                    setTimeout(() => {
                        window.close();
                    }, 500);
                } catch (reloadError) {
                    console.error('Error refreshing page:', reloadError);
                    showStatus('CSS applied but could not refresh page', 'success');
                }
            }, 1500); // Wait 1.5 seconds to show the success message
            
        } catch (error) {
            console.error('Error applying CSS:', error);
            showStatus('Processing... Please wait, then refresh the page', 'error');
        }
    });

    // Remove CSS button
    removeBtn.addEventListener('click', async function() {
        if (!currentTab) {
            showStatus('No active tab found', 'error');
            return;
        }

        try {
            // Remove CSS from storage
            await chrome.storage.local.remove([currentDomain]);
            
            // Send message to content script to remove CSS
            await chrome.tabs.sendMessage(currentTab.id, {
                action: 'removeCSS',
                domain: currentDomain
            });
            
            cssInput.value = NACION_CSS; // Keep showing the CSS
            showStatus('Paywall restored successfully!', 'success');
            domainStatusDiv.textContent = 'Paywall active';
            domainStatusDiv.style.color = '#f44336';
            
        } catch (error) {
            console.error('Error removing CSS:', error);
            showStatus('Error removing CSS', 'error');
        }
    });

    // Reset page button
    resetBtn.addEventListener('click', async function() {
        if (!currentTab) {
            showStatus('No active tab found', 'error');
            return;
        }

        try {
            await chrome.tabs.reload(currentTab.id);
            showStatus('Page reset successfully!', 'success');
            
            // Close popup after reload
            setTimeout(() => {
                window.close();
            }, 1000);
            
        } catch (error) {
            console.error('Error resetting page:', error);
            showStatus('Error resetting page', 'error');
        }
    });

    // Show status message
    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = `status ${type}`;
        statusDiv.style.display = 'block';
        
        // Hide status after 3 seconds
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 3000);
    }

});