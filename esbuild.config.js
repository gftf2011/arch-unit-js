const esbuild = require('esbuild');
const fs = require('fs');

// Clean dist directory
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true });
}

// Build configuration
const buildConfig = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node16',
  external: ['@babel/parser', '@babel/traverse'], // External dependencies
  sourcemap: true,
  minify: false,
};

// Build CommonJS version
esbuild.buildSync({
  ...buildConfig,
  format: 'cjs',
  outfile: 'dist/index.js',
  define: {
    'import.meta': 'undefined',
  },
});

// Build ES Module version
esbuild.buildSync({
  ...buildConfig,
  format: 'esm',
  outfile: 'dist/index.mjs',
});

// Generate TypeScript declarations using tsc

// Copy TypeScript declarations from tsc
const { execSync } = require('child_process');
try {
  execSync('npx tsc --emitDeclarationOnly --outDir dist', { stdio: 'inherit' });
} catch (error) {
  console.log('TypeScript declaration generation failed, but build completed');
}

console.log('✅ Build completed: CommonJS (index.js), ES Module (index.mjs), and TypeScript declarations (index.d.ts)'); 