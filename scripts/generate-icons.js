import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = path.join(__dirname, '../public/icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create a simple SVG template for each size
const createIconSVG = (size) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <defs>
    <linearGradient id="bg-gradient-${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8b5a3c;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#5d3a28;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="robot-gradient-${size}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#d4a574;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#a67c52;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow-${size}">
      <feDropShadow dx="0" dy="${size/128}" stdDeviation="${size/64}" flood-opacity="0.5"/>
    </filter>
  </defs>
  
  <rect width="${size}" height="${size}" rx="${size/4.6}" fill="url(#bg-gradient-${size})"/>
  
  <g filter="url(#shadow-${size})">
    <rect x="${size*0.305}" y="${size*0.273}" width="${size*0.39}" height="${size*0.39}" rx="${size*0.059}" fill="url(#robot-gradient-${size})" stroke="#3d2414" stroke-width="${size/128}"/>
    
    <circle cx="${size*0.422}" cy="${size*0.391}" r="${size*0.049}" fill="#1e90ff" opacity="0.9">
      <animate attributeName="opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="${size*0.578}" cy="${size*0.391}" r="${size*0.049}" fill="#1e90ff" opacity="0.9">
      <animate attributeName="opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite"/>
    </circle>
    
    <circle cx="${size*0.438}" cy="${size*0.375}" r="${size*0.016}" fill="#fff" opacity="0.8"/>
    <circle cx="${size*0.594}" cy="${size*0.375}" r="${size*0.016}" fill="#fff" opacity="0.8"/>
    
    <line x1="${size*0.5}" y1="${size*0.273}" x2="${size*0.5}" y2="${size*0.195}" stroke="#a67c52" stroke-width="${size/85.3}" stroke-linecap="round"/>
    <circle cx="${size*0.5}" cy="${size*0.186}" r="${size*0.023}" fill="#ff6b6b">
      <animate attributeName="fill" values="#ff6b6b;#ff4757;#ff6b6b" dur="1.5s" repeatCount="indefinite"/>
    </circle>
    
    <rect x="${size*0.383}" y="${size*0.527}" width="${size*0.234}" height="${size*0.078}" rx="${size*0.02}" fill="#3d2414" opacity="0.6"/>
    <line x1="${size*0.402}" y1="${size*0.547}" x2="${size*0.402}" y2="${size*0.586}" stroke="#8b5a3c" stroke-width="${size/256}"/>
    <line x1="${size*0.441}" y1="${size*0.547}" x2="${size*0.441}" y2="${size*0.586}" stroke="#8b5a3c" stroke-width="${size/256}"/>
    <line x1="${size*0.48}" y1="${size*0.547}" x2="${size*0.48}" y2="${size*0.586}" stroke="#8b5a3c" stroke-width="${size/256}"/>
    <line x1="${size*0.52}" y1="${size*0.547}" x2="${size*0.52}" y2="${size*0.586}" stroke="#8b5a3c" stroke-width="${size/256}"/>
    <line x1="${size*0.559}" y1="${size*0.547}" x2="${size*0.559}" y2="${size*0.586}" stroke="#8b5a3c" stroke-width="${size/256}"/>
    <line x1="${size*0.598}" y1="${size*0.547}" x2="${size*0.598}" y2="${size*0.586}" stroke="#8b5a3c" stroke-width="${size/256}"/>
  </g>
  
  <text x="${size*0.5}" y="${size*0.762}" font-family="Arial, sans-serif" font-size="${size*0.094}" font-weight="bold" fill="#d4a574" text-anchor="middle">BabyAGI</text>
  <text x="${size*0.5}" y="${size*0.84}" font-family="Arial, sans-serif" font-size="${size*0.047}" fill="#a67c52" text-anchor="middle">AI Agent</text>
</svg>`;
};

// Generate SVG files for each size
sizes.forEach(size => {
  const svgContent = createIconSVG(size);
  const filename = path.join(iconsDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(filename, svgContent);
  console.log(`Generated ${filename}`);
});

console.log('Icon generation complete!');
console.log('Note: For production, convert SVG to PNG using tools like sharp, imagemagick, or online converters');
