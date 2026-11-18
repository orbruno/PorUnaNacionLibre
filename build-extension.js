const fs = require('node:fs');
const path = require('node:path');
const manifest = require('./manifest.json');

const output = path.join(__dirname, 'dist');
const files = [
    'manifest.json',
    'content.js',
    'reading-styles.js',
    'popup.html',
    'popup.js',
    ...Object.values(manifest.icons)
];

for (const file of files) {
    const destination = path.join(output, file);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(__dirname, file), destination);
}

console.log(`Chrome extension ${manifest.version} is ready in ${output}`);
