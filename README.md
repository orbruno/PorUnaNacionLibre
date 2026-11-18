# CSS Domain Modifier Chrome Extension

See [the Nacion AddOn instructions](README-NACION.md) for the current `nacion.com` build and installation steps.

The original CSS Domain Modifier notes below describe the starting point for this project.

## Features

- ✨ Apply custom CSS to any website
- 💾 Save CSS rules per domain (automatically remembered)
- 🔄 Easy removal and reset functionality
- 🎨 Real-time CSS injection
- 📱 Clean, user-friendly popup interface
- 🚀 Works on all websites (http and https)

## Installation

Follow the [current installation steps](README-NACION.md).

## How to Use

1. **Navigate to any website** you want to modify
2. **Click the extension icon** in the toolbar to open the popup
3. **Enter your CSS code** in the text area (examples provided)
4. **Click "Apply CSS"** to inject your styles
5. **Click "Remove CSS"** to remove your custom styles
6. **Click "Reset Page"** to reload the page and remove all modifications

## CSS Examples

### Hide Elements

```css
/* Hide all advertisements */
.ad,
.advertisement,
.banner {
  display: none !important;
}

/* Hide specific elements by class */
.sidebar {
  display: none !important;
}

/* Hide elements by ID */
#header {
  display: none !important;
}
```

### Change Appearance

```css
/* Change background color */
body {
  background-color: #f0f0f0 !important;
}

/* Apply dark theme */
body {
  background: #1a1a1a !important;
  color: #ffffff !important;
}

/* Custom fonts */
* {
  font-family: "Arial", sans-serif !important;
}
```

### Advanced Styling

```css
/* Blur images */
img {
  filter: blur(2px) !important;
}

/* Add gradient background */
body {
  background: linear-gradient(45deg, #667eea, #764ba2) !important;
}

/* Round all corners */
* {
  border-radius: 10px !important;
}
```

## Technical Details

### Files Structure

- `manifest.json` - Extension configuration
- `popup.html` - Extension popup interface
- `popup.js` - Popup functionality
- `content.js` - Script that runs on web pages
- `icons/` - Extension icons

### Permissions

- `activeTab` - Access to the current active tab
- `storage` - Save CSS rules per domain
- `host_permissions` - Access to all websites

### Storage

CSS rules are saved locally using Chrome's storage API, keyed by domain name. This means your custom CSS will persist across browser sessions.

## Troubleshooting

### Extension not working?

1. Make sure you've enabled the extension in `chrome://extensions/`
2. Try refreshing the page after applying CSS
3. Check that the website allows content script injection
4. Some sites with strict Content Security Policies might block CSS injection

### CSS not applying?

1. Use `!important` in your CSS rules for higher specificity
2. Check for syntax errors in your CSS
3. Try more specific selectors
4. Some elements might be dynamically generated - try targeting parent elements

### Reset everything

If something goes wrong, you can:

1. Click "Reset Page" to reload the current page
2. Remove the extension and reinstall it
3. Clear extension data in Chrome settings

## Development

To modify this extension:

1. Make changes to the files
2. Go to `chrome://extensions/`
3. Click the refresh icon next to your extension
4. Test your changes

## Privacy

This extension:

- ✅ Only accesses the websites you visit
- ✅ Stores data locally on your device
- ✅ Does not send any data to external servers
- ✅ Does not track your browsing habits

## Version History

### v1.0

- Initial release
- Basic CSS injection functionality
- Per-domain storage
- Clean popup interface
- Auto-save functionality
