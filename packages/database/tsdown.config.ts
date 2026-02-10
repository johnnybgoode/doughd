import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/**/*', '!src/seed.ts'],
  format: ['esm'],
  outDir: './dist',
  outExtensions: () => ({
    js: '.js',
  }),
});
