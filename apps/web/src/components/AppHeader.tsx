import { Heading } from '@repo/ui/components/typography';
import { Link } from 'react-router';

export const AppHeader = () => (
  <header className="p-6">
    <Heading level="2">
      <Link className="hover:text-[var(--primary)]" to="/recipes">
        Dough'd
      </Link>
    </Heading>
  </header>
);
