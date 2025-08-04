import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';

const buildOptions = {
  entryPoints: [{ in: 'public/browser_jr_login.mjs', out: 'browser_jr_login' }],
  bundle: true,
  format: 'esm',
  target: ['es2020'],
  sourcemap: true,
  splitting: true,
  outdir: 'build',
  outExtension: { '.js': '.mjs'},
  metafile: true,
  logLevel: 'info',
  loader: {
    '.wasm': 'file',
    '.mp4': 'file',
    '.css': 'file',
  },
};

function printBuildOutput() {
  const outDir = path.resolve('build');
  const files = fs.readdirSync(outDir);
  console.log(`\n📦 Build output (${files.length} files):`);
  for (const file of files) {
    const stat = fs.statSync(path.join(outDir, file));
    const size = (stat.size / 1024 / 1024).toFixed(1); // MB
    const padFile = file.padEnd(45, ' ');
    const padSize = size.toString().padStart(5, ' ');
    const flag = stat.size > 1024 * 1024 ? '⚠️' : '  ';
    console.log(`  build/${padFile} ${padSize}mb ${flag}`);
  }
}

// 1. Initial context
const context = await esbuild.context(buildOptions);

// 2. First build manually
await context.rebuild();
printBuildOutput();

// 3. Rebuild on watch
context.onRebuild = (error, result) => {
  if (error) {
    console.error('❌ Rebuild failed:', error);
  } else {
    console.log('✅ Rebuild succeeded.');
    printBuildOutput();
  }
};

await context.watch();
console.log('👀 Esbuild is watching for changes...');
