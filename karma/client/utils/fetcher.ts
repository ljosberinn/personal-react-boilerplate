import type { IncomingMessage } from 'http';
import absoluteUrl from 'next-absolute-url';

import type { RequestInitMethod } from '../../utils/requestMethods';

/**
 * Utility function to make authenticated requests in getServerSideProps/getStaticProps
 *
 * @param method
 */
const createAuthenticatedFetch = (method: RequestInitMethod) => (
  endpoint: string,
  req: IncomingMessage,
  options: RequestInit = {}
): Promise<Response> => {
  const { origin } = absoluteUrl(req);
  const url = [
    origin,
    endpoint.startsWith('/') ? endpoint.slice(1) : endpoint,
  ].join('/');

  const headers: RequestInit['headers'] = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(req.headers.cookie ? { cookie: req.headers.cookie } : {}),
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
    method,
  });
};

type AuthenticatedFetchMap = {
  [K in RequestInitMethod]: ReturnType<typeof createAuthenticatedFetch>;
};

export const authenticatedFetch: AuthenticatedFetchMap = {
  delete: createAuthenticatedFetch('delete'),
  get: createAuthenticatedFetch('get'),
  head: createAuthenticatedFetch('head'),
  options: createAuthenticatedFetch('options'),
  patch: createAuthenticatedFetch('patch'),
  post: createAuthenticatedFetch('post'),
  put: createAuthenticatedFetch('put'),
  trace: createAuthenticatedFetch('trace'),
};
