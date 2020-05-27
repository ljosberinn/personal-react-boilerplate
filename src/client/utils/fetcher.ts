import { IncomingMessage } from 'http';
import absoluteUrl from 'next-absolute-url';

const methods = [
  'get',
  'head',
  'post',
  'put',
  'delete',
  'options',
  'trace',
  'patch',
] as const;

type RequestInitMethod = typeof methods[number];

const makeAuthenticatedFetch = (method: RequestInitMethod) => <T>(
  endpoint: string | string[],
  req: IncomingMessage,
  options: RequestInit = {}
): Promise<T> => {
  const { origin } = absoluteUrl(req);

  const segments = Array.isArray(endpoint) ? endpoint : [endpoint];

  const url = [origin, 'api', ...segments].join('/');

  return fetch(url, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      ...options.headers,
      ...(req?.headers.cookie ? { cookie: req.headers.cookie } : {}),
    },
    method,
  })
    .then(response => response.json())
    .then(data => data.json || data);
};

type AuthenticatedFetchMap = {
  [K in RequestInitMethod]: ReturnType<typeof makeAuthenticatedFetch>;
};

export const authenticatedFetch = methods.reduce(
  (carry, method) => ({ ...carry, [method]: makeAuthenticatedFetch(method) }),
  {}
) as AuthenticatedFetchMap;
