import { defineConfig, mergeConfig } from 'vitest/config';
import { sharedConfig } from './shared.js';

export const makeBaseConfig = (testConfig = {}) =>
  mergeConfig(
    testConfig,
    defineConfig({
      test: {
        clearMocks: true,
        css: false,
        ...sharedConfig.test,
      },
    }),
  );

export const baseConfig = makeBaseConfig();
