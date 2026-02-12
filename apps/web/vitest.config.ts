import { makeBaseConfig } from '@repo/vitest-config/base';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineProject, mergeConfig } from 'vitest/config';
import { alias } from './vite.config';

const config = mergeConfig(
  makeBaseConfig({
    resolve: {
      alias,
    },
    test: {
      plugins: [react()],
      coverage: {
        exclude: ['main.tsx'],
      },
    },
  }),
  {
    test: {
      pool: 'threads',
      projects: [
        defineProject({
          plugins: [react()],
          resolve: {
            alias,
          },
          test: {
            name: 'unit',
            include: ['**/unit/**/*.test.ts?(x)'],
            environment: 'happy-dom',
            globals: true,
          },
        }),
        defineProject({
          optimizeDeps: {
            include: ['react-dom/client'],
          },
          plugins: [react()],
          resolve: {
            alias,
          },
          test: {
            name: 'integration',
            include: ['**/integration/*.test.ts?(x)'],
            isolate: true,
            browser: {
              provider: playwright(),
              enabled: true,
              headless: true,
              instances: [{ browser: 'chromium' }],
            },
          },
        }),
      ],
    },
  },
);

export default config;
