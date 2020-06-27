import { createServer } from 'http';
import nextConnect, { NextConnect } from 'next-connect';
import { apiResolver } from 'next/dist/next-server/server/api-utils';
import { route } from 'next/dist/next-server/server/router';
import fetch from 'node-fetch';
import listen from 'test-listen';

import { Middleware } from '../src/server/types';

interface UrlArguments {
  url: string;
  searchParams?: Record<string, string> | URLSearchParams;
  method?: RequestInit['method'];
  body?: Record<string, string>;
  catchAllName?: string;
  middleware?: Middleware | Middleware[];
}

const getUrl = (
  index: string,
  maybeUrl: string | URL = '/',
  maybeParams: UrlArguments['searchParams'] = {}
) => {
  const url = maybeUrl instanceof URL ? maybeUrl : new URL(index + maybeUrl);
  const params =
    maybeParams instanceof URLSearchParams
      ? maybeParams
      : new URLSearchParams(maybeParams);

  params.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  return url.toString();
};

const withMiddleware = (
  handler: NextConnect,
  middleware?: UrlArguments['middleware']
) => {
  if (!middleware) {
    return handler;
  }

  const middlewaresToApply = Array.isArray(middleware)
    ? middleware
    : [middleware];

  const connected = nextConnect();

  middlewaresToApply.forEach(middleware => {
    connected.use(middleware);
  });

  connected.use(handler);

  return connected;
};

export const testLambda = async (
  handler: NextConnect,
  {
    url,
    searchParams,
    method = 'GET',
    body,
    catchAllName,
    middleware,
  }: UrlArguments
) => {
  const server = createServer((req, res) =>
    apiResolver(req, res, undefined, withMiddleware(handler, middleware), {
      previewModeEncryptionKey: '',
      previewModeId: '',
      previewModeSigningKey: '',
    })
  );

  const index = await listen(server);

  const urlToFetch = (() => {
    if (catchAllName) {
      const matcher = route('/:path*');
      const { path }: { path: string[] } = matcher(url);

      /**
       * Next doesnt allow nested catch all routes such as
       * /api/[...foo]/bar/[...baz].js
       * so we only care about
       * /api/[...foo].js
       */
      const lastSegment = path.pop() as string;

      // migrate all previous search params if existing
      const params =
        searchParams instanceof URLSearchParams
          ? searchParams
          : new URLSearchParams(searchParams);

      /**
       * workaround for catchall routes
       * append the same key twice automatically makes it an array which is
       * required for the catchall logic in the handler to work as expected
       *
       * downside: the empty value will show up in the lambda as 2nd argument
       * probably won't matter though
       */
      const query = [
        params.toString(),
        // order is important - key with value must come before key without value
        `${catchAllName}=${lastSegment}`,
        catchAllName,
      ]
        // filter in case params is empty
        .filter(Boolean)
        .join('&');

      const pathname = path.join('/') + '/';
      const affix = [pathname, query].join('?');

      return [index, affix].join('/');
    }

    return url || searchParams ? getUrl(index, url, searchParams) : index;
  })();

  return await fetch(urlToFetch, {
    body: body ? JSON.stringify(body) : undefined,
    method,
  });
};
