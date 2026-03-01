import type { RecipePureType } from '@repo/database/schemas';
import { Button } from '@repo/ui/components/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
} from '@repo/ui/components/card';
import { Image } from '@repo/ui/components/image';
import { Heading } from '@repo/ui/components/typography';
import { PencilIcon } from 'lucide-react';
import { Link } from 'react-router';

type RecipeCardProps = {
  recipe: RecipePureType;
};
export const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <Card className="group relative hover:shadow-md">
      <div className="absolute top-[0] right-[0] z-10 mt-4 mr-4 hidden group-hover:block">
        <Link to={`${recipe.id}/edit`}>
          <Button className="cursor-pointer" variant="secondary">
            <PencilIcon />
          </Button>
        </Link>
      </div>
      <CardContent className="flex flex-col items-center opacity-85 hover:opacity-100">
        <Link className="" to={recipe.slug}>
          {recipe.image && (
            <div className="mb-6 sm:mb-4">
              <Image alt={recipe.title} src={recipe.image} />
            </div>
          )}
        </Link>
        <CardTitle>
          <Link className="" to={recipe.slug}>
            <Heading level="3">{recipe.title}</Heading>
          </Link>
        </CardTitle>
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <Link className="" to={recipe.slug}>
          <Button className="cursor-pointer px-8">Bake It</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
