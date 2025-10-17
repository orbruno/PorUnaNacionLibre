// content.js - Content script that runs on nacion.com

(function() {
    'use strict';
    
    let currentDomain = window.location.hostname;
    let injectedStyleElement = null;
    
    // Only run on nacion.com
    if (!currentDomain.includes('nacion.com')) {
        return;
    }
    
    // Block specific scripts that interfere with paywall removal
    const blockedScripts = [
        'm=Wt6vjf,hhhU8,FCpbqb,WhJNk',
        'm=p3hmRc,LvGhrf,RqjULd',
        'm=n73qwf,aW3pY,UUJqVe,IZT63,e5qFLc,O1Gjze,O6y8ed,MpJwZc,PrPYRd,XVMNvd,KUM7Z,qTnoBf,duFQFc,SdcwHb,pw70Gc,wmnU7d,xQtZb,QIhFr,hc6Ubd,SpsfSb,Z5uLle,MdUzUe,zbML3c',
        'BhLmsae8UGPdRwoG1XwqOKY5MfgCxlr0JKNLJ-Y7Bq0.js',
        'tag_assistant_api_bin.js',
        'm=W93Wdc'
    ];
    
    // Block scripts and iframes before they load
    blockScripts();
    blockIframes();
    blockIframesWithCSS();
    
    // Function to block unwanted scripts
    function blockScripts() {
        // Override createElement to block script elements
        const originalCreateElement = document.createElement;
        document.createElement = function(tagName) {
            const element = originalCreateElement.call(this, tagName);
            
            if (tagName.toLowerCase() === 'script') {
                // Monitor when src is set
                const originalSetAttribute = element.setAttribute;
                element.setAttribute = function(name, value) {
                    if (name.toLowerCase() === 'src' && shouldBlockScript(value)) {
                        console.log('Nacion.com Modifier: Blocked script:', value);
                        return; // Don't set the src, effectively blocking the script
                    }
                    return originalSetAttribute.call(this, name, value);
                };
                
                // Monitor direct src property assignment
                Object.defineProperty(element, 'src', {
                    set: function(value) {
                        if (shouldBlockScript(value)) {
                            console.log('Nacion.com Modifier: Blocked script:', value);
                            return; // Don't set the src
                        }
                        this.setAttribute('src', value);
                    },
                    get: function() {
                        return this.getAttribute('src');
                    }
                });
            }
            
            return element;
        };
        
        // Also block existing scripts in the DOM
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.tagName === 'SCRIPT') {
                        const src = node.src || node.getAttribute('src');
                        if (src && shouldBlockScript(src)) {
                            console.log('Nacion.com Modifier: Removing existing script:', src);
                            node.remove();
                        }
                    }
                });
            });
        });
        
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }
    
    // Check if a script should be blocked
    function shouldBlockScript(src) {
        if (!src) return false;
        
        return blockedScripts.some(blocked => {
            return src.includes(blocked) || src.includes(encodeURIComponent(blocked));
        });
    }
    
    // Function to block unwanted iframes
    function blockIframes() {
        // Override createElement to block iframe elements
        const originalCreateElement = document.createElement;
        document.createElement = function(tagName) {
            const element = originalCreateElement.call(this, tagName);
            
            if (tagName.toLowerCase() === 'iframe') {
                // Immediately check if this should be blocked
                const shouldBlock = function() {
                    const src = element.src || element.getAttribute('src');
                    return src && shouldBlockIframe(src);
                };
                
                // Monitor when src is set
                const originalSetAttribute = element.setAttribute;
                element.setAttribute = function(name, value) {
                    if (name.toLowerCase() === 'src' && shouldBlockIframe(value)) {
                        console.log('Nacion.com Modifier: Blocked iframe creation:', value);
                        return; // Don't set the src, effectively blocking the iframe
                    }
                    const result = originalSetAttribute.call(this, name, value);
                    // Double-check after setting any attribute
                    if (shouldBlock()) {
                        console.log('Nacion.com Modifier: Removing iframe after attribute set:', value);
                        setTimeout(() => element.remove(), 0);
                    }
                    return result;
                };
                
                // Monitor direct src property assignment
                Object.defineProperty(element, 'src', {
                    set: function(value) {
                        if (shouldBlockIframe(value)) {
                            console.log('Nacion.com Modifier: Blocked iframe src assignment:', value);
                            return; // Don't set the src
                        }
                        this.setAttribute('src', value);
                    },
                    get: function() {
                        return this.getAttribute('src');
                    }
                });
                
                // Check periodically if iframe becomes blocked
                const checkInterval = setInterval(() => {
                    if (shouldBlock()) {
                        console.log('Nacion.com Modifier: Removing iframe via periodic check');
                        element.remove();
                        clearInterval(checkInterval);
                    }
                    if (!document.contains(element)) {
                        clearInterval(checkInterval);
                    }
                }, 100);
            }
            
            return element;
        };
        
        // Also block existing iframes in the DOM with more aggressive detection
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check the node itself
                        if (node.tagName === 'IFRAME') {
                            const src = node.src || node.getAttribute('src');
                            if (shouldBlockIframe(src)) {
                                console.log('Nacion.com Modifier: Removing iframe via mutation observer:', src);
                                node.remove();
                                return;
                            }
                        }
                        
                        // Check all iframe descendants
                        const iframes = node.querySelectorAll ? node.querySelectorAll('iframe') : [];
                        iframes.forEach(function(iframe) {
                            const src = iframe.src || iframe.getAttribute('src');
                            if (shouldBlockIframe(src)) {
                                console.log('Nacion.com Modifier: Removing descendant iframe:', src);
                                iframe.remove();
                            }
                        });
                    }
                });
            });
        });
        
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src']
        });
        
        // Remove any existing iframes immediately
        setTimeout(() => {
            const existingIframes = document.querySelectorAll('iframe');
            existingIframes.forEach(function(iframe) {
                const src = iframe.src || iframe.getAttribute('src');
                if (shouldBlockIframe(src)) {
                    console.log('Nacion.com Modifier: Removing pre-existing iframe:', src);
                    iframe.remove();
                }
            });
        }, 0);
    }
    
    // Check if an iframe should be blocked
    function shouldBlockIframe(src) {
        if (!src) return false;
        
        // Block Google Subscribe with Google iframes
        const blockedIframePatterns = [
            'news.google.com/swg',
            'subscribewithgoogle',
            'serviceiframe',
            'swg/ui/v1/serviceiframe',
            'serviceiframe', // Partial match for the iframe you're seeing
            'sut=', // Parameter in the subscribe iframe
            'publicationId=nacion.com' // Specific to nacion.com
        ];
        
        return blockedIframePatterns.some(pattern => {
            return src.includes(pattern);
        });
    }
    
    // Function to block iframes with CSS as backup
    function blockIframesWithCSS() {
        const cssRules = `
            /* Block Subscribe with Google iframes */
            iframe[src*="news.google.com/swg"],
            iframe[src*="subscribewithgoogle"],
            iframe[src*="serviceiframe"],
            iframe[src*="erviceiframe"],
            iframe[src*="sut="],
            iframe[src*="publicationId=nacion.com"] {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                width: 0 !important;
                height: 0 !important;
                position: absolute !important;
                left: -9999px !important;
                pointer-events: none !important;
            }
        `;
        
        const styleElement = document.createElement('style');
        styleElement.textContent = cssRules;
        document.head.appendChild(styleElement);
        
        console.log('Nacion.com Modifier: Added CSS-based iframe blocking');
    }
    
    // Initialize the extension when the page loads
    init();
    
    async function init() {
        console.log('Nacion.com Modifier: Initializing for', currentDomain);
        
        // Load and apply any saved CSS for this domain
        await loadAndApplyCSS();
        
        // Listen for messages from popup
        chrome.runtime.onMessage.addListener(handleMessage);
    }
    
    // Load CSS from storage and apply it
    async function loadAndApplyCSS() {
        try {
            const result = await chrome.storage.local.get([currentDomain]);
            if (result[currentDomain]) {
                applyCSS(result[currentDomain]);
                console.log('Nacion.com Modifier: Applied saved CSS for', currentDomain);
            }
        } catch (error) {
            console.error('Nacion.com Modifier: Error loading CSS:', error);
        }
    }
    
    // Handle messages from popup
    function handleMessage(request, sender, sendResponse) {
        console.log('Nacion.com Modifier: Received message:', request);
        
        switch (request.action) {
            case 'applyCSS':
                applyCSS(request.css);
                sendResponse({ success: true });
                break;
                
            case 'removeCSS':
                removeCSS();
                sendResponse({ success: true });
                break;
                
            default:
                sendResponse({ success: false, error: 'Unknown action' });
        }
        
        return true; // Keep the message channel open for async response
    }
    
    // Apply CSS to the page
    function applyCSS(cssCode) {
        try {
            // Remove existing injected CSS
            removeCSS();
            
            // Create new style element
            injectedStyleElement = document.createElement('style');
            injectedStyleElement.type = 'text/css';
            injectedStyleElement.id = 'css-domain-modifier-styles';
            injectedStyleElement.textContent = cssCode;
            
            // Add CSS comment for identification
            const comment = `\n/* CSS injected by CSS Domain Modifier extension for ${currentDomain} */\n`;
            injectedStyleElement.textContent = comment + cssCode;
            
            // Inject into head
            document.head.appendChild(injectedStyleElement);
            
            console.log('Nacion.com Modifier: CSS applied successfully');
            
            // Show temporary notification
            showNotification('Paywall removed!', 'success');
            
        } catch (error) {
            console.error('Nacion.com Modifier: Error applying CSS:', error);
            showNotification('Error removing paywall', 'error');
        }
    }
    
    // Remove injected CSS
    function removeCSS() {
        if (injectedStyleElement && injectedStyleElement.parentNode) {
            injectedStyleElement.parentNode.removeChild(injectedStyleElement);
            injectedStyleElement = null;
            console.log('Nacion.com Modifier: CSS removed successfully');
            showNotification('Paywall restored!', 'success');
        }
    }
    
    // Show notification to user
    function showNotification(message, type) {
        // Remove existing notification
        const existingNotification = document.getElementById('css-domain-modifier-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.id = 'css-domain-modifier-notification';
        notification.textContent = message;
        
        // Style the notification
        const notificationStyles = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 999999 !important;
            padding: 12px 20px !important;
            border-radius: 6px !important;
            font-family: Arial, sans-serif !important;
            font-size: 14px !important;
            font-weight: bold !important;
            color: white !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
            transition: all 0.3s ease !important;
            opacity: 0 !important;
            transform: translateX(100px) !important;
            pointer-events: none !important;
            ${type === 'success' ? 'background: #4CAF50 !important;' : 'background: #f44336 !important;'}
        `;
        
        notification.style.cssText = notificationStyles;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Handle page navigation (for single-page applications)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            const newDomain = window.location.hostname;
            if (newDomain !== currentDomain) {
                currentDomain = newDomain;
                console.log('Nacion.com Modifier: Domain changed to', currentDomain);
                loadAndApplyCSS();
            }
        }
    }).observe(document, { subtree: true, childList: true });
    
})();