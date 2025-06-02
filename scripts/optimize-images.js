const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const QUALITY = 85;
const MAX_WIDTH = 1920;

async function optimizeImage(inputPath, outputPath) {
  const metadata = await sharp(inputPath).metadata();
  
  // Skip if already optimized (small file size)
  const stats = await fs.stat(inputPath);
  if (stats.size < 200 * 1024) { // Skip if less than 200KB
    console.log(`Skipping ${path.basename(inputPath)} - already optimized`);
    return;
  }

  await sharp(inputPath)
    .resize(Math.min(metadata.width, MAX_WIDTH), null, {
      withoutEnlargement: true
    })
    .webp({ quality: QUALITY })
    .toFile(outputPath.replace('.png', '.webp').replace('.jpg', '.webp'));
    
  console.log(`Optimized ${path.basename(inputPath)} - ${(stats.size / 1024 / 1024).toFixed(2)}MB → WebP`);
}

async function processDirectory(dir) {
  const files = await fs.readdir(dir, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      await processDirectory(fullPath);
    } else if (/\.(png|jpg|jpeg)$/i.test(file.name)) {
      const outputPath = fullPath;
      await optimizeImage(fullPath, outputPath);
    }
  }
}

async function main() {
  console.log('Starting image optimization...');
  await processDirectory('./public');
  console.log('Image optimization complete!');
}

main().catch(console.error); 