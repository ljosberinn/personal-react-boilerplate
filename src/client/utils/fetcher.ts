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

const sanitizePathname = (endpoint: string | string[]) => {
  if (Array.isArray(endpoint)) {
    return endpoint.join('/').replace('//', '/');
  }

  return endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
};

const makeAuthenticatedFetch = (method: RequestInitMethod) => <T>(
  endpoint: string | string[],
  req: IncomingMessage,
  options: RequestInit = {}
): Promise<T> => {
  const { origin } = absoluteUrl(req);
  const url = [origin, 'api', sanitizePathname(endpoint)].join('/');

  return fetch(url, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      ...options.headers,
      cookie: req.headers.cookie || '',
    },
    method,
    // eslint-disable-next-line promise/prefer-await-to-then
  }).then(response => response.json());
};

type AuthenticatedFetchMap = {
  [K in RequestInitMethod]: ReturnType<typeof makeAuthenticatedFetch>;
};

export const authenticatedFetch = methods.reduce(
  (carry, method) => ({ ...carry, [method]: makeAuthenticatedFetch(method) }),
  {}
) as AuthenticatedFetchMap;
