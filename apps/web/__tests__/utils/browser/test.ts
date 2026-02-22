import { test as viteTest } from 'vitest';
import { worker } from '../../mocks/setupTestWorker';

export const test = viteTest.extend<{ worker: typeof worker }>({
  worker: [
    // biome-ignore lint: Unexpected empty object pattern.
    async ({}, use) => {
      await worker.start({ quiet: true });
      await use(worker);
      worker.resetHandlers();
      worker.stop();
    },
    {
      auto: true,
    },
  ],
});

export const it = test;
