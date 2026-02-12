import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import { Page } from '@/components/Page';

const TestHeader = () => <>Header</>;
const TestContent = () => <>Test Content</>;
const ChildWillThrow = () => {
  throw new Error('Error in child component');
};

describe('Page', () => {
  it('renders header and children', async () => {
    render(
      <Page header={<TestHeader />}>
        <TestContent />
      </Page>,
    );
    await screen.findByText(/header/i);
    await screen.findByText(/test content/i);
  });

  it('renders header if child throws', async () => {
    render(
      <Page header={<TestHeader />}>
        <ChildWillThrow />
      </Page>,
    );
    await screen.findByText(/header/i);
  });
});
