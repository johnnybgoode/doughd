import { screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import { ErrorAlert } from '@/components/ErrorAlert';
import { appRender } from '../../utils/renderRtl';

describe('ErrorWarning', () => {
  it('renders', async () => {
    appRender(
      <ErrorAlert message="Something unexpected happened" title="Error!" />,
    );
    screen.getByText(/error/i);
    screen.getByText(/something unexpected/i);
  });
});
