import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/**/*', '!tests/**/*'],
  format: ['esm'],
  outExtensions: () => ({
    js: '.js',
  }),
});
