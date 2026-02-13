type FetchParams = Parameters<typeof fetch>;
type FetchInput = FetchParams[0];
type FetchOpts = FetchParams[1] & {};
type RequestOpts = Omit<FetchOpts, 'method'>;
type DefaultOpts = Omit<RequestOpts, 'body' | 'signal'> & {
  // biome-ignore lint: suspicious/noExplicitAny
  responseParser?: (response: Response) => any;
};

export class HttpError extends Error {
  public response: Response;

  constructor(res: Response, options?: ErrorOptions) {
    super(res.statusText, options);
    this.response = res;
    this.name = this.constructor.name;
  }
  get statusCode() {
    return this.response.status;
  }
  get statusText() {
    return this.response.statusText;
  }
}

const mergeOpts = <T extends DefaultOpts, O extends RequestOpts>(
  defaults: T,
  opts: O = {} as O,
) => ({
  ...opts,
  ...defaults,
  headers: {
    ...opts,
    ...defaults,
  },
});

const doFetch = async <O extends RequestOpts>(url: FetchInput, opts: O) => {
  const response = await fetch(url, opts);
  if (response.status >= 400) {
    throw new HttpError(response);
  }
  return response;
};

const isCallable = <F extends Function>(fn?: F): fn is F =>
  typeof fn !== 'undefined' && typeof fn === 'function';

export const makeHttpClient = <
  T extends DefaultOpts,
  R extends FetchOpts = Omit<RequestOpts, keyof T>,
>(
  { responseParser, ...defaultOpts }: T = {} as T,
) => {
  const parseResponse = async (response: Response) => {
    if (isCallable(responseParser)) {
      return responseParser(response);
    }
    return response;
  };

  const getWithResponse = (url: FetchInput, opts?: R) =>
    doFetch(url, {
      ...mergeOpts(defaultOpts, opts),
      method: 'GET',
    });
  const postWithResponse = <D extends {}>(url: FetchInput, data: D, opts?: R) =>
    doFetch(url, {
      ...mergeOpts(defaultOpts, opts),
      body: JSON.stringify(data),
      method: 'POST',
    });
  const putWithResponse = <D extends {}>(url: FetchInput, data: D, opts?: R) =>
    doFetch(url, {
      ...mergeOpts(defaultOpts, opts),
      body: JSON.stringify(data),
      method: 'PUT',
    });
  const deleteWithResponse = (url: FetchInput, opts?: R) =>
    doFetch(url, {
      ...mergeOpts(defaultOpts, opts),
      method: 'DELETE',
    });

  const get = async <D extends {}>(url: FetchInput): Promise<D | null> =>
    parseResponse(await getWithResponse(url));

  const post = async <D extends {}>(
    url: FetchInput,
    // biome-ignore lint: suspicious/noExplicitAny
    data: any,
  ): Promise<D | null> => parseResponse(await postWithResponse(url, data));

  const put = async <D extends {}>(
    url: FetchInput,
    // biome-ignore lint: suspicious/noExplicitAny
    data: any,
  ): Promise<D | null> => parseResponse(await putWithResponse(url, data));

  const deleteRequest = async <D extends {}>(
    url: FetchInput,
  ): Promise<D | null> => parseResponse(await deleteWithResponse(url));

  return {
    getWithResponse,
    postWithResponse,
    putWithResponse,
    deleteWithResponse,
    get,
    post,
    put,
    delete: deleteRequest,
  } as const;
};

const client = makeHttpClient({
  credentials: 'same-origin',
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
  mode: 'same-origin',
  priority: 'auto',
  referer: `${window.location.hostname}/${window.location.pathname}`,
  responseParser: async response => {
    try {
      const json = await response.json();
      return json;
    } catch (__e) {
      return null;
    }
  },
});

export default client;
