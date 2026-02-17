import { Recipe } from '@repo/database';
import supertest from 'supertest';
import { describe, expect, it } from 'vitest';
import { server } from './utils/setup';

describe('/api/recipe', () => {
  it('POST creates a complete recipe', async () => {
    await supertest(server)
      .post('/api/recipe')
      .send({
        title: 'Sourdough recipe',
        slug: 'sourdough-recipe',
        credit: 'Crusty Baker',
        image: 'sourdough.png',
        ingredients: [
          {
            name: 'flour',
            unit: 'g',
            value: 100,
          },
        ],
        portions: {
          unit: 'loaf',
          units: 'loaves',
          value: 1,
        },
        steps: [
          {
            title: 'Mix dough',
            description: 'Combine all ingredients and mix thoroughly',
            time: 600,
          },
        ],
      })
      .expect(200)
      .then((res) => {
        expect(res.body.id).toBe(1);
        expect(res.body.title).toBe('Sourdough recipe');
        expect(res.body.slug).toBe('sourdough-recipe');
        expect(res.body.credit).toBe('Crusty Baker');
        expect(res.body.image).toBe('sourdough.png');
        expect(res.body.ingredients[0].name).toBe('flour');
      });
  });

  it('POST sets default slug', async () => {
    await supertest(server)
      .post('/api/recipe')
      .send({
        title: '~~ Fancy Apple* pie ~~',
      })
      .expect(200)
      .then((res) => {
        expect(res.body.slug).toBe('fancy-apple-pie');
      });
  });

  it('GET returns all recipes', async () => {
    await supertest(server)
      .get('/api/recipe')
      .expect(200)
      .then((res) => {
        expect(res.body.length).toBe(2);
        expect(res.body[0].title).toBe('Sourdough recipe');
        expect(res.body[1].slug).toBe('fancy-apple-pie');
      });
  });

  it('GET /:id returns one recipe', async () => {
    await supertest(server)
      .get('/api/recipe/1')
      .expect(200)
      .then((res) => {
        expect(res.body.id).toBe(1);
        expect(res.body.title).toBe('Sourdough recipe');
        expect(res.body.slug).toBe('sourdough-recipe');
        expect(res.body.credit).toBe('Crusty Baker');
        expect(res.body.image).toBe('sourdough.png');
      });
  });

  it('GET /by-slug/:slug returns one recipe', async () => {
    await supertest(server)
      .get('/api/recipe/by-slug/sourdough-recipe')
      .expect(200)
      .then((res) => {
        expect(res.body.id).toBe(1);
        expect(res.body.title).toBe('Sourdough recipe');
        expect(res.body.slug).toBe('sourdough-recipe');
        expect(res.body.credit).toBe('Crusty Baker');
        expect(res.body.image).toBe('sourdough.png');
      });
  });

  it('PUT updates a recipe', async () => {
    await supertest(server)
      .put('/api/recipe/1')
      .send({
        title: 'Best Sourdough',
        slug: 'best-sourdough',
        image: 'sourdough-hires.png',
        ingredients: [
          {
            name: 'flour',
            unit: 'g',
            value: 100,
          },
          {
            name: 'starter',
            unit: 'g',
            value: 50,
          },
        ],
      })
      .expect(200)
      .then((res) => {
        expect(res.body.id).toBe(1);
        expect(res.body.title).toBe('Best Sourdough');
        expect(res.body.slug).toBe('best-sourdough');
        expect(res.body.credit).toBe('Crusty Baker');
        expect(res.body.image).toBe('sourdough-hires.png');
        expect(res.body.ingredients[0].name).toBe('flour');
        expect(res.body.ingredients[1].name).toBe('starter');
      });
  });

  it('GET returns updated recipe', async () => {
    await supertest(server)
      .get('/api/recipe/1')
      .expect(200)
      .then((res) => {
        expect(res.body.id).toBe(1);
        expect(res.body.title).toBe('Best Sourdough');
        expect(res.body.slug).toBe('best-sourdough');
        expect(res.body.credit).toBe('Crusty Baker');
        expect(res.body.image).toBe('sourdough-hires.png');
      });
  });

  it('GET returns 404s for non-existent recipes', async () => {
    await supertest(server)
      .get('/api/recipe/99999')
      .expect(404)
      .then((res) => {
        expect(res.body.message).toBe('Recipe not found');
      });

    await supertest(server)
      .get('/api/recipe/foo')
      .expect(404)
      .then((res) => {
        expect(res.body.message).toBe('Recipe not found');
      });
  });

  it('PUT does not update recipe id', async () => {
    await supertest(server)
      .put('/api/recipe/1')
      .send({
        id: 3,
        title: 'Sourdough',
        slug: 'sourdough',
      })
      .expect(200)
      .then((res) => {
        expect(res.body.id).toBe(1);
      });
  });

  it('DELETE soft deletes a recipe', async () => {
    await supertest(server)
      .delete('/api/recipe/2')
      .expect(200)
      .then((res) => {
        console.log(res.body);
        expect(res.body.slug).toContain('//archived-');
      });
  });

  it('GET does not return deleted recipes by default', async () => {
    await supertest(server)
      .get('/api/recipe')
      .expect(200)
      .then((res) => {
        expect(res.body.filter((r: Recipe) => r.id === 2).length).toBe(0);
      });
  });

  it('GET returns archived recipes with query param', async () => {
    await supertest(server)
      .get('/api/recipe?includeArchived=1')
      .expect(200)
      .then((res) => {
        expect(res.body.length).toBeGreaterThan(1);
        expect(res.body.filter((r: Recipe) => r.id === 1).length).toBe(1);
      });
  });

  // Validation
  it('POST rejects duplicate slug', async () => {
    await supertest(server)
      .post('/api/recipe')
      .send({
        title: 'Sourdough recipe',
        slug: 'sourdough-recipe',
      })
      .expect(200);

    await supertest(server)
      .post('/api/recipe')
      .send({
        title: 'Sourdough recipe',
        slug: 'sourdough-recipe',
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe('Failed to create recipe');
      });
  });

  it('POST rejects invalid recipe', async () => {
    await supertest(server)
      .post('/api/recipe')
      .send({
        name: 'Sourdough',
        path: 'sourdough',
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe('Invalid recipe');
      });
  });

  it('PUT rejects invalid update', async () => {
    await supertest(server)
      .put('/api/recipe/1')
      .send({
        name: 'Sourdough',
        path: 'sourdough',
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe('Invalid recipe');
      });
  });

  it('POST rejects invalid ingredients', async () => {
    await supertest(server)
      .post('/api/recipe')
      .send({
        title: 'Bad ingredients',
        slug: 'bad-ingredients',
        // Ingredients expects array
        ingredients: {
          name: 'Flour',
          unit: 'g',
          value: 100,
        },
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe('Invalid recipe');
      });

    await supertest(server)
      .post('/api/recipe')
      .send({
        title: 'Bad ingredients',
        slug: 'bad-ingredients',
        // Invalid keys
        ingredients: [
          {
            label: 'Flour',
            units: 'g',
            amount: 100,
          },
        ],
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe('Invalid recipe');
      });
  });

  it('POST rejects invalid portions', async () => {
    await supertest(server)
      .post('/api/recipe')
      .send({
        title: 'Bad portions',
        slug: 'bad-portions',
        // Invalid keys
        portions: {
          portion: 'rolls',
          amount: 12,
        },
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe('Invalid recipe');
      });
  });

  it('POST rejects invalid steps', async () => {
    await supertest(server)
      .post('/api/recipe')
      .send({
        title: 'Bad ingredients',
        slug: 'bad-ingredients',
        // Steps expects array
        steps: {
          title: 'Step 1',
          description: 'The first step.',
          time: 10,
        },
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe('Invalid recipe');
      });

    await supertest(server)
      .post('/api/recipe')
      .send({
        title: 'Bad ingredients',
        slug: 'bad-ingredients',
        // Invalid keys
        ingredients: [
          {
            name: 'Step 1',
            body: 'The first step.',
            length: 10,
          },
        ],
      })
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe('Invalid recipe');
      });
  });
});
