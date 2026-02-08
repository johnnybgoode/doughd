import { makeBaseConfig } from '@repo/vitest-config/base';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineProject, mergeConfig } from 'vitest/config';

const config = mergeConfig(
  makeBaseConfig({
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
          test: {
            name: 'browser',
            include: ['**/browser/*.test.ts?(x)'],
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
