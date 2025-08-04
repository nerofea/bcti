const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const inputDir = './input';  // technically at time of creation of profile, the profile is not yet in a registry, s9 i think there is an individual edge worker where this might be happening
const outputDir = './journalist_registry_compressed';

const fileName = process.argv[2]; // e.g., alice.json

if (!fileName) {
  console.error('❌ Please specify a filename. Example: node compress_single.js alice.json');
  process.exit(1);
}

const inputPath = path.join(inputDir, fileName);
const outputPath = path.join(outputDir, `${fileName}.gz`);

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
if (!fs.existsSync(inputPath)) {
  console.error(`❌ File not found: ${inputPath}`);
  process.exit(1);
}

const input = fs.createReadStream(inputPath);
const output = fs.createWriteStream(outputPath);

input.pipe(zlib.createGzip()).pipe(output);

output.on('close', () => {
  console.log(`✅ Compressed: ${fileName} → ${fileName}.gz`);
});
