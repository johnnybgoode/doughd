import cors from 'cors';
import express, { type Express } from 'express';
import morgan from 'morgan';
import { makeRouter } from './recipe';

export const makeServer = (): Express => {
  const app = express();

  app
    .disable('x-powered-by')
    .use(morgan('dev'))
    .use(express.urlencoded({ extended: true }))
    .use(express.json())
    .use(cors())
    .use('/api', makeRouter());

  return app;
};
