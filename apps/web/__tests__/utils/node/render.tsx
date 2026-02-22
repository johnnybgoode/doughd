import { type RenderResult, render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { AppProviders } from '../AppProviders';

type Queries = typeof import('@testing-library/dom/types/queries');

export const appRender = (
  ui: ReactElement,
): RenderResult<Queries, HTMLElement> =>
  render(<AppProviders>{ui}</AppProviders>);
