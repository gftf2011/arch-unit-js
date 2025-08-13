import dts from 'rollup-plugin-dts';

export default {
  input: 'dist/types/src/index.d.ts',
  output: [{ file: 'dist/index.d.ts', format: 'es' }],
  plugins: [
    dts({
      tsconfig: './tsconfig.json', // 👈 Make sure it's pointing to the right file
    }),
  ],
  onwarn(warning, warn) {
    if (warning.code === 'EMPTY_BUNDLE') return;
    warn(warning);
  },
};
