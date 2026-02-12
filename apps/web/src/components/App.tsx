import { Heading } from '@repo/ui/components/typography';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Page } from './Page';

const AsyncRecipeListing = React.lazy(async () =>
  import('./RecipeListing').then(m => ({ default: m.RecipeListing })),
);

export const App = () => {
  return (
    <Page header={<Heading level="2">Dough'd</Heading>}>
      <Routes>
        <Route Component={AsyncRecipeListing} path="/recipes" />
        <Route element={<Navigate to="/recipes" />} path="*" />
      </Routes>
    </Page>
  );
};
