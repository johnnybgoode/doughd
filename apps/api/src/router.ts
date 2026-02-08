import express, { type Router } from 'express';

export const makeRouter = (): Router => {
  const router = express.Router();

  router.get('/', (_, res) => {
    res.json({ message: 'Hello, World!' });
  });

  return router;
};
