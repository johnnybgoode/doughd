import { type Express } from 'express';
import { beforeEach } from 'vitest';
import { makeServer } from '../../src/server';

let server: Express;

beforeEach(() => {
  server = makeServer();
});

export { server };
