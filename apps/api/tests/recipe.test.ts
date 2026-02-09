import supertest from 'supertest';
import { describe, expect, it } from 'vitest';
import { server } from './utils/setup';

describe('/api/recipe', () => {
  it('creates a recipe', async () => {
    await supertest(server)
      .post('/api/recipe')
      .send({
        title: 'Sourdough recipe',
        slug: 'sourdough-recipe',
        credit: 'Crusty Baker',
        image: 'sourdough.png',
        ingredients: {},
        portions: {},
        steps: [],
      })
      .expect(200)
      .then((res) => {
        expect(res.body.id).toBe(1);
        expect(res.body.title).toBe('Sourdough recipe');
        expect(res.body.slug).toBe('sourdough-recipe');
        expect(res.body.credit).toBe('Crusty Baker');
        expect(res.body.image).toBe('sourdough.png');
      });
  });

  it('does not allow duplicate slug', async () => {
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

  it('rejects invalid recipe', async () => {
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

  it('sets default slug', async () => {
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

  it('gets all recipes', async () => {
    await supertest(server)
      .get('/api/recipe')
      .expect(200)
      .then((res) => {
        expect(res.body.length).toBe(2);
        expect(res.body[0].title).toBe('Sourdough recipe');
        expect(res.body[1].slug).toBe('fancy-apple-pie');
      });
  });

  it('gets one recipe', async () => {
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

  it('gets one recipe by slug', async () => {
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

  it('updates a recipe', async () => {
    await supertest(server)
      .put('/api/recipe/1')
      .send({
        title: 'Best Sourdough',
        slug: 'best-sourdough',
        image: 'sourdough-hires.png',
      })
      .expect(200)
      .then((res) => {
        expect(res.body.id).toBe(1);
        expect(res.body.title).toBe('Best Sourdough');
        expect(res.body.slug).toBe('best-sourdough');
        expect(res.body.credit).toBe('Crusty Baker');
        expect(res.body.image).toBe('sourdough-hires.png');
      });
  });

  it('gets updated recipe', async () => {
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

  it('does not get invalid recipes', async () => {
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

  it('does not update recipe id', async () => {
    await supertest(server)
      .put('/api/recipe/1')
      .send({
        id: 2,
        title: 'Sourdough',
        slug: 'sourdough',
      })
      .expect(200)
      .then((res) => {
        expect(res.body.id).toBe(1);
      });
  });

  it('rejects invalid update', async () => {
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

  it('delete is not implemented', async () => {
    await supertest(server).delete('/api/recipe/1').expect(500);
  });
});
