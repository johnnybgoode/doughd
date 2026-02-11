import { ErrorBoundary } from 'react-error-boundary';
import { RecipeListing } from './RecipeListing';

export const App = () => (
  <ErrorBoundary fallbackRender={() => 'Error :('}>
    <RecipeListing />
  </ErrorBoundary>
);
