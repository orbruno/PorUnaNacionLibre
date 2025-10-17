# Nacion.com Paywall Remover

A Chrome extension that removes paywalls and subscription modals from nacion.com, allowing you to read articles without restrictions.

## 🚀 Quick Start

1. **Install**: Load this extension in Chrome (Developer mode)
2. **Visit**: Go to any nacion.com article
3. **Click**: Extension icon in toolbar
4. **Remove**: Click "Remove Paywall" button
5. **Read**: Enjoy unrestricted access to articles

## ✨ What It Does

- ❌ Removes subscription modals
- ❌ Hides paywall prompts
- ❌ Eliminates checkout screens
- ✅ Shows hidden article content
- ✅ Enables page scrolling
- ✅ Restores normal browsing

## 🎯 Target Domain

This extension **only works on nacion.com** and its subdomains for security and privacy reasons.

## 🔧 Installation

1. Download/clone this extension folder
2. Open Chrome → `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked" → Select this folder
5. Extension icon appears in toolbar

## 🛠 How It Works

The extension injects CSS that:

```css
/* Hides subscription modals */
.tp-modal {
  display: none !important;
}

/* Removes paywall overlays */
.tp-backdrop.tp-active {
  display: none !important;
}

/* Shows article content */
[class="article-body-wrapper__styled"] {
  display: unset !important;
  opacity: unset !important;
}

/* Enables scrolling */
html,
body {
  overflow: auto !important;
}
```

## 🔒 Privacy & Security

- ✅ Only accesses nacion.com
- ✅ No data sent to external servers
- ✅ No tracking or analytics
- ✅ Local storage only
- ✅ Open source code

## 🐛 Troubleshooting

**Not working?**

- Refresh the page after clicking "Remove Paywall"
- Make sure you're on nacion.com
- Check that extension is enabled
- Try "Reset Page" button

**Still blocked?**

- Some pages may have additional protection
- Try refreshing and clicking the extension quickly
- Clear browser cache if needed

## ⚖️ Legal Notice

This extension is for educational purposes. Users are responsible for complying with nacion.com's terms of service and local laws regarding web content access.

## 🔄 Version History

**v1.0** - Initial release targeting nacion.com paywalls
