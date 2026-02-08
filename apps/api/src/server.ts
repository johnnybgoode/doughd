import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import express, { type Express } from 'express';
import morgan from 'morgan';
import { makeRouter } from './router';

export const makeServer = (): Express => {
  const app = express();

  app
    .disable('x-powered-by')
    .use(morgan('dev'))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .use('/api', makeRouter());

  return app;
};
