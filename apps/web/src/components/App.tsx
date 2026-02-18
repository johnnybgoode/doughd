import { Heading } from '@repo/ui/components/typography';
import React from 'react';
import { Link, Navigate, Route, Routes } from 'react-router';
import { Page } from './Page';

const AsyncRecipeListing = React.lazy(async () =>
  import('./RecipeListing').then(m => ({ default: m.RecipeListing })),
);

const AsyncRecipeDetailView = React.lazy(async () =>
  import('./RecipeDetail').then(m => ({ default: m.RecipeDetailView })),
);

export const App = () => {
  return (
    <Page
      header={
        <Heading level="2">
          <Link className="hover:text-[var(--primary)]" to="/recipes">
            Dough'd
          </Link>
        </Heading>
      }
    >
      <Routes>
        <Route element={<AsyncRecipeDetailView />} path="/recipes/:slug" />
        <Route element={<AsyncRecipeListing />} path="/recipes" />
        <Route element={<Navigate to="/recipes" />} path="*" />
      </Routes>
    </Page>
  );
};
