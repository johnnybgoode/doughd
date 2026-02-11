import type { PropsWithChildren, ReactElement } from 'react';

type PageProps = PropsWithChildren<{ header: ReactElement }>;

export const Page = ({ children, header }: PageProps) => {
  return (
    <div className="flex h-screen flex-col">
      {header}
      <div className="flex-1 place-content-center overflow-y-scroll bg-gray-50 p-4">
        {children}
      </div>
    </div>
  );
};
