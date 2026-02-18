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
import { Link } from 'react-router';

type RecipeCardProps = {
  recipe: RecipePureType;
};
export const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <Link className="" to={recipe.slug}>
      <Card className="hover:shadow-md">
        <CardContent className="flex flex-col items-center opacity-85 hover:opacity-100">
          {recipe.image && (
            <div className="mb-6 sm:mb-4">
              <Image alt={recipe.title} src={recipe.image} />
            </div>
          )}
          <CardTitle>
            <Heading level="3">{recipe.title}</Heading>
          </CardTitle>
        </CardContent>
        <CardFooter className="flex flex-col items-center">
          <Button className="cursor-pointer px-8">Bake It</Button>
        </CardFooter>
      </Card>
    </Link>
  );
};
