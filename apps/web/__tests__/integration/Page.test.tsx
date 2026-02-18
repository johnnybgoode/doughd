import { describe, expect, it } from 'vitest';
import { Page } from '@/components/Page';
import { appRender } from '../utils/render/renderBrowser';

const TestHeader = () => <>Header</>;
const TestContent = () => <>Test Content</>;
const ChildWillThrow = () => {
  throw new Error('Error in child component');
};

describe('Page', () => {
  it('renders header and children', async () => {
    const screen = await appRender(
      <Page header={<TestHeader />}>
        <TestContent />
      </Page>,
    );
    await expect.element(screen.getByText(/header/i)).toBeVisible();
    await expect.element(screen.getByText(/test content/i)).toBeVisible();
  });

  it('renders header if child throws', async () => {
    const screen = await appRender(
      <Page header={<TestHeader />}>
        <ChildWillThrow />
      </Page>,
    );
    await expect.element(screen.getByText(/header/i)).toBeVisible();
  });
});
