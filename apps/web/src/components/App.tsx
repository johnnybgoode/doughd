import { Heading } from '@repo/ui/components/typography';
import { Page } from './Page';
import { RecipeListing } from './RecipeListing';

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
        <RecipeListing />
      </Page>
    </div>
  );
};
