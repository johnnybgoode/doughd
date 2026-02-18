import type { ReactElement } from 'react';
import { expect } from 'vitest';
import type { Locator } from 'vitest/browser';
import { type RenderResult, render } from 'vitest-browser-react';
import { withProviders } from './withProviders';

export const appRender = (ui: ReactElement) => render(withProviders(ui));

// TODO move to separate `utils` module after separating mocks / utils.
type WaitForElementToBeRemovedOptions = {
  maxTries?: number;
  strict?: boolean;
  timeout?: number;
};
export const waitForElementToBeRemoved = async (
  locator: Locator,
  { maxTries, strict, timeout }: WaitForElementToBeRemovedOptions = {
    maxTries: 5,
    strict: true,
    timeout: 250,
  },
) => {
  let intervalId: number;
  let retries = 0;
  return new Promise((resolve, reject) => {
    try {
      if (strict) {
        expect(locator).toBeInTheDocument();
      }
      intervalId = setInterval(() => {
        try {
          ++retries;
          expect(locator).not.toBeInTheDocument();
          clearInterval(intervalId);
          resolve(locator);
        } catch {
          if (retries === maxTries) {
            clearInterval(intervalId);
            reject(
              new Error("waitForElementToBeRemoved element wasn't removed"),
            );
          }
        }
      }, timeout);
    } catch {
      reject(
        new Error(
          'waitForElementToBeRemoved unable to find element to be removed',
        ),
      );
    }
  });
};

export const waitForLoading = (
  screen: RenderResult,
  options?: WaitForElementToBeRemovedOptions,
) =>
  waitForElementToBeRemoved(
    screen.getByRole('status', { name: /loading/i }),
    options,
  );
