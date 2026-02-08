import { delay, HttpResponse, http } from 'msw';

type HttpResponseOptions = Parameters<typeof HttpResponse.json>[1] & {
  delay?: Parameters<typeof delay>[0];
};

export const makeGetApiHandler = (
  data: { message: string },
  { delay: delayOpt, ...options }: HttpResponseOptions = {
    status: 200,
    delay: 0,
  },
) =>
  http.get('/api', async () => {
    if (delayOpt) {
      await delay(delayOpt);
    }
    return HttpResponse.json(data, options);
  });
