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
  sourcemap: false,
  minify: true,
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

console.log('✅ Build completed: CommonJS (index.js), ES Module (index.mjs)');
