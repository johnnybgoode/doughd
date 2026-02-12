import { render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { describe, it } from 'vitest';
import { ErrorAlert } from '@/components/ErrorAlert';
import { withProviders } from '../../utils/render/withProviders';

// @todo make this exportable
const appRender = (ui: ReactElement) => render(withProviders(ui));

describe('ErrorWarning', () => {
  it('renders', async () => {
    appRender(
      <ErrorAlert message="Something unexpected happened" title="Error!" />,
    );
    screen.getByText(/error/i);
    screen.getByText(/something unexpected/i);
  });
});
