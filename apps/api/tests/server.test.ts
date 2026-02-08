import supertest from 'supertest';
import { describe, expect, it } from 'vitest';
import { server } from './utils/setup';

describe('server', () => {
  it('returns a 200 status', async () => {
    await supertest(server).get('/api').expect(200);
  });
});
