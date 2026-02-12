import { HttpResponse, http as httpMsw } from 'msw';
import { describe, expect, it } from 'vitest';
import http from '../../../src/lib/http';
import { server } from '../../utils/setupServer';

type TestResponse = { ok: boolean };

describe('http client', () => {
  it('GETs Json', async () => {
    server.use(httpMsw.get('/api/test', () => HttpResponse.json({ ok: true })));
    const result = await http.get<TestResponse>('/api/test');
    expect(result?.ok).toBe(true);
  });

  it('POSTs Json', async () => {
    server.use(
      httpMsw.post('/api/test', async ({ request }) => {
        const body = await request.json();
        return HttpResponse.json(body);
      }),
    );
    const result = await http.post<TestResponse>('/api/test', { ok: true });
    expect(result?.ok).toBe(true);
  });

  it('PUTs Json', async () => {
    server.use(
      httpMsw.put('/api/test', async ({ request }) => {
        const body = await request.json();
        return HttpResponse.json(body);
      }),
    );
    const result = await http.put<TestResponse>('/api/test', { ok: true });
    expect(result?.ok).toBe(true);
  });

  it('DELETEs Json', async () => {
    server.use(
      httpMsw.delete('/api/test', () => HttpResponse.json({ ok: true })),
    );
    const result = await http.delete<TestResponse>('/api/test');
    expect(result?.ok).toBe(true);
  });

  it('getWithResponse returns a Response', async () => {
    server.use(httpMsw.get('/api/test', () => HttpResponse.json({ ok: true })));
    const response = await http.getWithResponse('/api/test');
    expect(response).toBeInstanceOf(Response);
  });

  it('postWithResponse returns a Response', async () => {
    server.use(
      httpMsw.post('/api/test', async ({ request }) => {
        const body = await request.json();
        return HttpResponse.json(body);
      }),
    );
    const response = await http.postWithResponse('/api/test', { ok: true });
    expect(response).toBeInstanceOf(Response);
  });

  it('putWithResponse returns a Response', async () => {
    server.use(
      httpMsw.put('/api/test', async ({ request }) => {
        const body = await request.json();
        return HttpResponse.json(body);
      }),
    );
    const response = await http.putWithResponse('/api/test', { ok: true });
    expect(response).toBeInstanceOf(Response);
  });

  it('deleteWithResponse returns a Response', async () => {
    server.use(
      httpMsw.delete('/api/test', () => HttpResponse.json({ ok: true })),
    );
    const response = await http.deleteWithResponse('/api/test');
    expect(response).toBeInstanceOf(Response);
  });
});
