#!/usr/bin/env node

// Simple script to generate icon files using SVG
const fs = require('fs');
const path = require('path');

// Create SVG icon content
function createSVGIcon(size) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#4CAF50;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#2196F3;stop-opacity:1" />
            </linearGradient>
        </defs>
        <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#grad)"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
              font-family="Arial, sans-serif" font-weight="bold" fill="white" 
              font-size="${size * 0.4}">CSS</text>
    </svg>`;
}

// Icon sizes for Chrome extension
const sizes = [16, 32, 48, 128];

// Create icon files
sizes.forEach(size => {
    const svgContent = createSVGIcon(size);
    const filename = `icon${size}.svg`;
    const filepath = path.join(__dirname, 'icons', filename);
    
    fs.writeFileSync(filepath, svgContent);
    console.log(`Created ${filename}`);
});

console.log('All icon files created successfully!');
console.log('Note: For production, consider converting SVG to PNG files using an online converter or tool like ImageMagick.');