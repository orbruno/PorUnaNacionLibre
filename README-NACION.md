# Nacion.com Paywall Remover

A browser extension for Chrome and Brave that applies reading styles to article content already loaded by nacion.com.

## 🚀 Quick Start

1. Prepare and load the `dist/` folder using the installation steps below.
2. **Visit**: Go to any nacion.com article
3. **Click**: Extension icon in toolbar
4. **Remove**: Click "Remove Paywall" button
5. The current tab reloads with the reading styles enabled.

## ✨ What It Does

- Hides the subscription modal and its backdrop.
- Shows article text already present in the page and restores scrolling.
- Restores the original page when you select "Restore Paywall".

## 🎯 Target Domain

This extension **only works on nacion.com** and its subdomains for security and privacy reasons.

## 🔧 Installation

1. Run `node build-extension.js` from the project folder to prepare `dist/`
2. Open `chrome://extensions/` in Chrome or `brave://extensions/` in Brave.
3. Enable "Developer mode" (top right)
4. Click "Load unpacked" → Select `dist/`
5. Extension icon appears in toolbar

After rebuilding, use "Reload" on the extension card and refresh the site.

## 🛠 How It Works

The [reading styles](reading-styles.js) make the article wrapper visible, hide the subscription modal and backdrop, and restore scrolling while the modal is active. One URL selector matches the Google subscription iframe.

The saved setting is used on subsequent pages on the same hostname. Version 1.2 uses the current reading styles when a previous version saved the original preset. Edited CSS is preserved and can still be changed in the popup.

## 🔒 Privacy & Security

- ✅ Only accesses nacion.com
- ✅ No data sent to external servers
- ✅ No tracking or analytics
- ✅ Local storage only
- ✅ Open source code

## 🐛 Troubleshooting

**Not working?**

- If you just updated the extension, reload it on the browser’s extensions page and refresh the article
- Make sure you're on nacion.com
- Check that extension is enabled
- Try "Reset Page" button

**Still blocked?**

- Some pages may have additional protection
- Clear browser cache if needed

## ⚖️ Legal Notice

This extension is for educational purposes. Users are responsible for complying with nacion.com's terms of service and local laws regarding web content access.

## 🔄 Version History

**v1.2** updates the article and modal styles and removes script and iframe interception.

**v1.1** saves the reading styles and reloads the tab when applying or restoring them.

**v1.0** - Initial release targeting nacion.com paywalls
