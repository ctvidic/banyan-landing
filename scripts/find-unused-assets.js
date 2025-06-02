const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Get all asset files
const assetFiles = glob.sync('./public/**/*.{png,jpg,jpeg,webp,mp4,svg}', { nodir: true });

// Get all source files
const sourceFiles = glob.sync('./app/**/*.{js,jsx,ts,tsx,css}').concat(
  glob.sync('./components/**/*.{js,jsx,ts,tsx,css}')
);

// Read all source content
let sourceContent = '';
sourceFiles.forEach(file => {
  sourceContent += fs.readFileSync(file, 'utf8') + '\n';
});

// Check each asset
const unusedAssets = [];
assetFiles.forEach(assetPath => {
  const assetName = path.basename(assetPath);
  const publicPath = assetPath.replace('./public', '');
  
  // Check if asset is referenced
  if (!sourceContent.includes(assetName) && !sourceContent.includes(publicPath)) {
    const stats = fs.statSync(assetPath);
    unusedAssets.push({
      path: assetPath,
      size: (stats.size / 1024 / 1024).toFixed(2) + 'MB'
    });
  }
});

// Print results
console.log('Unused assets found:');
console.log('====================');
let totalSize = 0;
unusedAssets.forEach(asset => {
  console.log(`${asset.path} (${asset.size})`);
  totalSize += parseFloat(asset.size);
});
console.log(`\nTotal unused: ${totalSize.toFixed(2)}MB`);
console.log(`\nRun 'rm ${unusedAssets.map(a => a.path).join(' ')}' to remove`); 