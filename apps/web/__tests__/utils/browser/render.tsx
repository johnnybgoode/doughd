import type { ReactElement } from 'react';
import { type RenderOptions, render } from 'vitest-browser-react';
import { type AppProviderProps, AppProviders } from '../AppProviders';

type AppRenderOptions = AppProviderProps & Omit<RenderOptions, 'wrapper'>;

export const appRender = (ui: ReactElement, options?: AppRenderOptions) => {
  const { initialEntries, mockRouter, dependencies, ...renderOptions } =
    options || {};

  return render(
    <AppProviders
      initialEntries={initialEntries}
      mockRouter={mockRouter}
      {...dependencies}
    >
      {ui}
    </AppProviders>,
    renderOptions,
  );
};
