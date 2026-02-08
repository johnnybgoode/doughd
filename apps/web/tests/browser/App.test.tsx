import { describe, expect } from 'vitest';
import { render } from 'vitest-browser-react';
import { App } from '../../src/components/App';
import { makeGetApiHandler } from '../mocks/handlers';
import { test } from './utils/setup';

describe('App', () => {
  test('renders a greeting', async ({ worker }) => {
    worker.use(makeGetApiHandler({ message: 'Hello, world!' }));

    const screen = await render(<App />);
    await expect.element(screen.getByText('Hello, world!')).toBeInTheDocument();
  });
});
