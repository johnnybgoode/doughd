import { Heading } from '@repo/ui/components/typography';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Navigate, Route, Routes } from 'react-router';
import { ErrorEmptyState } from './EmptyState';
import { Loading } from './Loading';
import { Page } from './Page';

const AsyncRecipeListing = React.lazy(async () =>
  import('./RecipeListing').then(m => ({ default: m.RecipeListing })),
);

export const App = () => {
  return (
    <div className="position-relative min-h-screen overflow-hidden">
      <Page
        header={
          <div className="p-6">
            <Heading level="2">Dough'd</Heading>
          </div>
        }
      >
        <ErrorBoundary fallback={<ErrorEmptyState action={null} />}>
          <Suspense fallback={<Loading center={true} size="lg" />}>
            <Routes>
              <Route Component={AsyncRecipeListing} path="/recipes" />
              <Route element={<Navigate to="/recipes" />} path="*" />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Page>
    </div>
  );
};
