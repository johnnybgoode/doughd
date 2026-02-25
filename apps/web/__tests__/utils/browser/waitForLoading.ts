import { type ExpectPollOptions, expect } from 'vitest';
import type { RenderResult } from 'vitest-browser-react';

export const waitForLoading = async (
  screen: RenderResult,
  options?: { strict?: boolean } & ExpectPollOptions,
) => {
  const { strict, ...expectOptions } = {
    strict: true,
    timeout: 1000,
    ...options,
  };
  try {
    await expect
      .element(screen.getByRole('status', { name: /loading/i }), expectOptions)
      .toBeInTheDocument();
    await expect
      .element(screen.getByRole('status', { name: /loading/i }), expectOptions)
      .not.toBeInTheDocument();
  } catch (e: unknown) {
    if (strict) {
      throw e;
    }
  }
};
