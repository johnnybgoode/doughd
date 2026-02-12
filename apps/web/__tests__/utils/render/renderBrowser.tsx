import type { ReactElement } from 'react';
import { render } from 'vitest-browser-react';
import { withProviders } from './withProviders';

export const appRender = (ui: ReactElement) => render(withProviders(ui));
