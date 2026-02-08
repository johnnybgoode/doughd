import { makeBaseConfig } from '@repo/vitest-config/base';
import { defineProject, mergeConfig } from 'vitest/config';

export default mergeConfig(
  makeBaseConfig({
    test: {
      coverage: {
        exclude: ['index.ts'],
      },
    },
  }),
  defineProject({
    test: {
      environment: 'node',
      include: ['**/*.test.ts'],
      globals: true,
      setupFiles: ['tests/utils/setup.ts'],
    },
  }),
);
