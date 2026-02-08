import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import { Greeting } from '../../../src/components/Greeting';
import { makeGetApiHandler } from '../../mocks/handlers';
import { server } from '../utils/setup';

describe('Greeting', () => {
  it('renders a message', async () => {
    server.use(makeGetApiHandler({ message: 'Hello, world!' }));
    render(<Greeting />);
    await screen.findByText(/hello, world/i);
  });

  it('renders placeholder on error', async () => {
    server.use(
      makeGetApiHandler({ message: 'Failed to get message' }, { status: 400 }),
    );
    render(<Greeting />);
    await screen.findByText(/hi/i);
  });

  it('renders loading text', async () => {
    server.use(
      makeGetApiHandler({ message: 'Hello, world! ' }, { delay: 'real' }),
    );
    render(<Greeting />);
    await screen.findByText(/loading/i);
  });
});
