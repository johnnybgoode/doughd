type FetchParams = Parameters<typeof fetch>;
type FetchInput = FetchParams[0];
type FetchOpts = FetchParams[1] & {};
type RequestOpts = Omit<FetchOpts, 'method'>;
type DefaultOpts = Omit<RequestOpts, 'body' | 'signal'> & {
  // biome-ignore lint: suspicious/noExplicitAny
  responseParser?: (response: Response) => any;
};

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

const isCallable = <F extends Function>(fn?: F): fn is F =>
  typeof fn !== 'undefined' && typeof fn === 'function';

export const makeHttpClient = <
  T extends DefaultOpts,
  R extends FetchOpts = Omit<RequestOpts, keyof T>,
>(
  defaultOpts: T = {} as T,
) => {
  const maybeResponseParser = defaultOpts.responseParser;
  const parseResponse = (response: Response) => {
    if (isCallable(maybeResponseParser)) {
      return maybeResponseParser(response);
    }
    return response.json();
  };

  const getWithResponse = (url: FetchInput, opts?: R) =>
    fetch(url, {
      ...mergeOpts(defaultOpts, opts),
      method: 'GET',
    });
  const postWithResponse = <D extends {}>(url: FetchInput, data: D, opts?: R) =>
    fetch(url, {
      ...mergeOpts(defaultOpts, opts),
      body: JSON.stringify(data),
      method: 'POST',
    });
  const putWithResponse = <D extends {}>(url: FetchInput, data: D, opts?: R) =>
    fetch(url, {
      ...mergeOpts(defaultOpts, opts),
      body: JSON.stringify(data),
      method: 'PUT',
    });
  const deleteWithResponse = (url: FetchInput, opts?: R) =>
    fetch(url, {
      ...mergeOpts(defaultOpts, opts),
      method: 'DELETE',
    });

  const get = async <D extends {}>(url: FetchInput): Promise<D | null> => {
    const res = await getWithResponse(url);
    return parseResponse(res);
  };
  const post = async <D extends {}>(
    url: FetchInput,
    // biome-ignore lint: suspicious/noExplicitAny
    data: any,
  ): Promise<D | null> => {
    const res = await postWithResponse(url, data);
    return parseResponse(res);
  };
  const put = async <D extends {}>(
    url: FetchInput,
    // biome-ignore lint: suspicious/noExplicitAny
    data: any,
  ): Promise<D | null> => {
    const res = await putWithResponse(url, data);
    return parseResponse(res);
  };
  const deleteRequest = async <D extends {}>(url: FetchInput): Promise<D | null> => {
    const res = await deleteWithResponse(url);
    return parseResponse(res);
  };

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
});

export default client;
