import { test as viteTest } from 'vitest';
import { server } from '../../mocks/setupTestServer';

export const test = viteTest.extend<{ server: typeof server }>({
  server: [
    // biome-ignore lint: Unexpected empty object pattern.
    async ({}, use) => {
      await server.listen();
      await use(server);
      server.resetHandlers();
      server.close();
    },
    {
      auto: true,
    },
  ],
});

export const it = test;
