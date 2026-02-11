import { Button } from '@repo/ui/components/button';
import { EmptyState } from './EmptyState';

export const ErrorEmptyState = () => (
  <EmptyState
    action={<Button onClick={() => window.location.reload()}>Reload</Button>}
    header="Something went wrong"
    icon="alert-octagon"
    message="There was a problem loading the content. Please try again."
  />
);
