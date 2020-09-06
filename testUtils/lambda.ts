import { serialize } from 'cookie';
import { createServer } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { NextConnect } from 'next-connect';
import nextConnect from 'next-connect';
import {
  apiResolver,
  getQueryParser,
} from 'next/dist/next-server/server/api-utils';
import { route } from 'next/dist/next-server/server/router';
import type { Response } from 'node-fetch';
import fetch from 'node-fetch';
import listen from 'test-listen';

import type { Middleware } from '../karma/server/types';
import type { RequestInitMethod } from '../karma/utils/requestMethods';

interface UrlArguments {
  /**
   * the endpoint to test
   */
  url: string;
  /**
   * optional search params
   */
  searchParams?: Record<string, string> | URLSearchParams;
  /**
   * HTTP request method
   *
   * @default GET
   */
  method?: RequestInitMethod;
  /**
   * any JSON payload
   */
  body?: Record<string, string> | string;
  /**
   * required to test a catchall lambda
   */
  catchAllName?: string;
  /**
   * next-connect compatible middleware(s)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  middleware?: Middleware<any, any> | Middleware<any, any>[];
  /**
   * optional headers passed to the request
   */
  headers?:
    | Record<string, string>
    | {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
        cookie: Record<string, string> | string;
      };
  /**
   * whether the request should follow a redirect
   */
  redirect?: RequestRedirect;
}

const getUrl = (
  index: string,
  maybeUrl: string | URL = '/',
  maybeParams: UrlArguments['searchParams'] = {}
): string => {
  const url = maybeUrl instanceof URL ? maybeUrl : new URL(index + maybeUrl);

  if (url.search) {
    throw new Error(
      'Use `searchParams` instead of appending `?foo=bar` to the url'
    );
  }

  const params =
    maybeParams instanceof URLSearchParams
      ? maybeParams
      : new URLSearchParams(maybeParams);

  params.forEach((value, key) => {
    url.searchParams.append(key, value);
  });

  return url.toString();
};

/**
 * Applies middlewares to tested lambdas
 *
 * @param handler
 * @param middleware
 */
const withMiddleware = (
  handler: NextConnect<NextApiRequest, NextApiResponse>,
  middleware?: UrlArguments['middleware']
): NextConnect<NextApiRequest, NextApiResponse<unknown>> => {
  if (!middleware) {
    return handler;
  }

  const middlewaresToApply = Array.isArray(middleware)
    ? middleware
    : [middleware];

  const connected = nextConnect();

  middlewaresToApply.forEach((middleware) => {
    connected.use(middleware);
  });

  connected.use(handler);

  return connected;
};

export const testLambda = async (
  handler: NextConnect<NextApiRequest, NextApiResponse>,
  {
    url,
    searchParams,
    method = 'get',
    body,
    catchAllName,
    middleware,
    headers,
    redirect,
  }: UrlArguments
): Promise<Response> => {
  const server = createServer((req, res) => {
    const getQuery = getQueryParser(req);

    const resolver = withMiddleware(handler, middleware);

    const apiContext = {
      previewModeEncryptionKey: '',
      previewModeId: '',
      previewModeSigningKey: '',
    };

    apiResolver(req, res, getQuery(), resolver, apiContext, true).catch(
      // eslint-disable-next-line no-console
      console.error
    );
  });

  const index = await listen(server);

  const urlToFetch = (() => {
    if (catchAllName) {
      const matcher = route('/:path*');
      const { path }: { path: string[] } = matcher(url);

      /**
       * Next doesnt allow nested catch all routes such as
       * /api/[...foo]/bar/[...baz].js
       * so we only have to care about
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
       * appending the same key twice automatically makes it an array which is
       * required for the catchall logic in the handler to work as expected
       *
       * downside: the empty value will show up in the lambda as 2nd argument
       * e.g. [...authRouter].ts will have
       * req.query.authRouter === ['login', '']
       *
       * probably won't matter though as we only care about [0]
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

      const pathname = `${path.join('/')}/`;
      const affix = [pathname, query].join('?');

      return [index, affix].join('/');
    }

    return url || searchParams ? getUrl(index, url, searchParams) : index;
  })();

  if (headers?.cookie) {
    headers.cookie = Object.entries(headers.cookie)
      .map(([key, value]) => serialize(key, value))
      .join(';');
  }

  const response = await fetch(urlToFetch, {
    body: body ? JSON.stringify(body) : undefined,
    headers,
    method,
    redirect,
  });

  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
};
