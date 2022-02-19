import { serialize } from 'cookie';
import { createServer } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { NextConnect } from 'next-connect';
import nextConnect from 'next-connect';
import type { NextApiRequestQuery } from 'next/dist/server/api-utils';
import { apiResolver } from 'next/dist/server/api-utils/node';
import { route } from 'next/dist/server/router';
import type { Response } from 'node-fetch';
import fetch from 'node-fetch';
import listen from 'test-listen';
import { URL } from 'url';

import { FALLBACK_LANGUAGE } from '../src/constants';
import type { Middleware } from '../src/server/types';
import type { RequestInitMethod } from '../src/utils/requestMethods';

type UrlArguments = {
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

const apiContext = {
  previewModeEncryptionKey: '',
  previewModeId: '',
  previewModeSigningKey: '',
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
    if (req.url) {
      const resolver = withMiddleware(handler, middleware);
      const query = parseQuery(req.url);

      apiResolver(req, res, query, resolver, apiContext, true).catch(
        // eslint-disable-next-line no-console
        console.error
      );
    }
  });

  const index = await listen(server);

  const urlToFetch = determineUrl(index, { catchAllName, searchParams, url });

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

type DetermineUrlParams = Pick<
  UrlArguments,
  'url' | 'catchAllName' | 'searchParams'
>;

/**
 * retrieves the correct URL to fetch in a test environment
 */
const determineUrl = (
  index: string,
  { url, catchAllName, searchParams }: DetermineUrlParams
) => {
  if (!catchAllName) {
    return url || searchParams ? getUrl(index, url, searchParams) : index;
  }

  // use nextjs internal route matching fn
  const matcher = route('/:path*');
  const { path }: { path: string[] } = matcher(url);

  /**
   * Next doesnt allow nested catch all routes such as
   * /api/[...foo]/bar/[...baz].js
   * so we only have to care about
   * /api/[...foo].js
   */
  const lastSegment: string = path.pop()!;

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
    `__nextLocale=${FALLBACK_LANGUAGE}`,
    // order is important - key with value must come before key without value
    `${catchAllName}=${lastSegment}`,
    catchAllName,
  ]
    // filter in case params is empty
    .filter(Boolean)
    .join('&');

  /**
   * from `['api', 'v1', 'auth']` and `'me=me&me`'
   * to `'/api/v1/auth?me=me&me'`
   */
  const currentRoute = `/${path.join('/')}?${query}`;

  // attach to current server index
  return index + currentRoute;
};

const getUrl = (
  index: string,
  maybeUrl: string | URL = '/',
  maybeParams: UrlArguments['searchParams'] = {}
): string => {
  const url = maybeUrl instanceof URL ? maybeUrl : new URL(index + maybeUrl);

  if (url.search) {
    throw new Error(
      '[Karma/testLambda]: Use `searchParams` instead of appending `?foo=bar` to the url'
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

const parseQuery = (url: string) => {
  const params = new URL(url, 'https://n').searchParams;

  const query: NextApiRequestQuery = {};

  for (const [key, value] of params) {
    // param given multiple times
    if (query[key]) {
      const previousValue = query[key];

      // param given at least 2x previously
      if (Array.isArray(previousValue)) {
        // merge
        query[key] = [...previousValue, value];
      } else {
        // group
        query[key] = [previousValue, value];
      }
    } else {
      // initial define
      query[key] = value;
    }
  }

  return query;
};
