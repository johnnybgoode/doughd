import type { ReactElement } from 'react';
import { render } from 'vitest-browser-react';
import { type ProviderProps, withProviders } from './withProviders';

export const appRender = (ui: ReactElement, options?: ProviderProps) =>
  render(withProviders(ui, options));

// TODO move to separate `utils` module after separating mocks / utils.
export const delay = (time: number) => {
  return new Promise(resolve => setTimeout(resolve, time));
};
