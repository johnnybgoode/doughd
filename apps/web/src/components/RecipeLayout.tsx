import { Separator } from '@repo/ui/components/separator';
// import type { PropsWithChildren } from 'react';
import React from 'react';
import createSlots from '@/lib/createSlots';

const [Slots, Slot] = createSlots([
  'Image',
  'Title',
  'Credit',
  'Ingredients',
  'Steps',
]);

export const RecipeLayout = ({
  children,
}: React.ComponentPropsWithRef<'div'>) => {
  return (
    <Slots>
      {Slots => (
        <div className="mx-auto flex max-w-5xl flex-1 flex-col items-center px-10">
          <div className="my-8 flex min-w-full">
            {Slots.Image}
            <div className="ml-10 flex-grow-1 place-content-center text-center">
              {Slots.Title}
              {Slots.Credit}
            </div>
          </div>
          <div className="mb-4 flex w-full justify-start gap-10">
            <div className="min-w-60">{Slots.Ingredients}</div>
            <div className="mx-0 flex-grow-1">
              <Separator />
              {Slots.Steps}
              {children}
            </div>
          </div>
        </div>
      )}
    </Slots>
  );
};

RecipeLayout.Slot = Slot;
