const { TsconfigPathsPlugin } = require('@esbuild-plugins/tsconfig-paths');
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
  target: 'node18',
  sourcemap: false,
  minify: true,
  plugins: [TsconfigPathsPlugin({ tsconfig: 'tsconfig.build.json' })],
};

async function buildAll() {
  await esbuild.build({
    ...buildConfig,
    format: 'cjs',
    outfile: 'dist/index.js',
    define: {
      'import.meta': 'undefined',
    },
  });

  await esbuild.build({
    ...buildConfig,
    format: 'esm',
    outfile: 'dist/index.mjs',
  });

  console.log('✅ Build completed: CommonJS (index.js), ES Module (index.mjs)');
}

buildAll().catch((error) => {
  console.error(error);
  process.exit(1);
});
