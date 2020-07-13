import { IncomingMessage } from 'http';
import absoluteUrl from 'next-absolute-url';

import { RequestInitMethod } from '../../utils/requestMethods';

/**
 * Utility function to make authenticated requests in getServerSideProps/getStaticProps
 *
 * @param method
 */
const makeAuthenticatedFetch = (method: RequestInitMethod) => <T>(
  endpoint: string,
  req: IncomingMessage,
  options: RequestInit = {}
): Promise<T> => {
  const { origin } = absoluteUrl(req);
  const url = [
    origin,
    endpoint.startsWith('/') ? endpoint.slice(1) : endpoint,
  ].join('/');

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

export const authenticatedFetch: AuthenticatedFetchMap = {
  delete: makeAuthenticatedFetch('delete'),
  get: makeAuthenticatedFetch('get'),
  head: makeAuthenticatedFetch('head'),
  options: makeAuthenticatedFetch('options'),
  patch: makeAuthenticatedFetch('patch'),
  post: makeAuthenticatedFetch('post'),
  put: makeAuthenticatedFetch('put'),
  trace: makeAuthenticatedFetch('trace'),
};
