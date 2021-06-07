import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult as NextGetServerSidePropsResult,
  Redirect,
} from 'next';
import type { ParsedUrlQuery } from 'querystring';

import { FALLBACK_LANGUAGE } from '../../constants';
import type NotFound from '../../pages/404';
import { getSession } from '../../server/auth/cookie';
import { attachInitialContext } from '../../utils/sentry/client';
import { attachLambdaContext } from '../../utils/sentry/server';
import { TEMPORARY_REDIRECT } from '../../utils/statusCodes';
import type { KarmaSSRProps } from './SSR';
import { getI18n } from './i18n';
import type {
  IsomorphicI18nRequirements,
  KarmaCoreProps,
  UnknownObjectValues,
} from './types';

/**
 * Return value of `(create)GetServerSideProps` if redirecting server side.
 *
 * Only internally relevant.
 *
 * @see `getServerSideProps`
 */
type SSRRedirectPropSubset = Pick<KarmaSSRProps, 'auth'> & {
  i18n: {
    resources: Record<string, unknown>;
    locale: string;
  };
};

type NextServerSidePropsResultWithoutProps = Exclude<
  NextGetServerSidePropsResult<unknown>,
  UnknownObjectValues<'props'>
>;

type NotFound = Exclude<
  NextServerSidePropsResultWithoutProps,
  UnknownObjectValues<'redirect'>
>;

export type CreateGetServerSidePropsOptions = {
  i18n: IsomorphicI18nRequirements;
  auth?: Pick<KarmaCoreProps['auth'], 'redirectDestinationIfUnauthenticated'>;
};

export type GetServerSidePropsResult<Props = Record<string, unknown>> =
  | { props: { karma: SSRRedirectPropSubset } }
  | Promise<{
      props: { karma: KarmaSSRProps & Props };
    }>;

/**
 * @example
 * ```js
 * export const getServerSideProps = createGetServerSideProps({
 *   i18n: {
 *     i18nNamespaces: ['serviceWorker', 'theme'],
 *     language: 'en',
 *   },
 *   auth: {
 *     redirectDestinationIfUnauthenticated: '/login',
 *   },
 * })
 * ```
 */
export const createGetServerSideProps =
  (options: CreateGetServerSidePropsOptions) =>
  (context: GetServerSidePropsContext): GetServerSidePropsResult =>
    getServerSideProps(context, options);

/**
 * only use if you don't care about loading all i18n namespaces on this route
 *
 * @see `createGetServerSideProps`
 * @example
 * ```js
 * export { getServerSideProps } from '../karma/client/Karma';
 * ```
 */
export const getServerSideProps = (
  { req, res, locale = FALLBACK_LANGUAGE }: GetServerSidePropsContext,
  options?: CreateGetServerSidePropsOptions
): GetServerSidePropsResult => {
  const { i18n: i18nOptions, auth: authOptions } = options ?? {};
  const session = getSession(req);

  if (!session && authOptions?.redirectDestinationIfUnauthenticated) {
    const { redirectDestinationIfUnauthenticated } = authOptions;

    // client-side routing, see https://github.com/vercel/next.js/discussions/11281#discussioncomment-2384
    if (!req.headers.referer) {
      res.writeHead(TEMPORARY_REDIRECT, {
        Location: redirectDestinationIfUnauthenticated,
      });

      res.end();
    }

    return {
      props: {
        // type SSRRedirectPropSubset
        karma: {
          auth: {
            redirectDestinationIfUnauthenticated,
            session: null,
          },
          i18n: {
            locale: FALLBACK_LANGUAGE,
            resources: {},
          },
        },
      },
    };
  }

  attachLambdaContext(req);

  attachInitialContext({
    locale,
    req,
    session,
  });

  const auth: KarmaSSRProps['auth'] = {
    session,
  };

  const cookies = req?.headers.cookie ?? '';

  return getI18n(locale, {
    namespaces: i18nOptions?.namespaces,
    // eslint-disable-next-line promise/prefer-await-to-then
  }).then((resources) => {
    const i18n: KarmaSSRProps['i18n'] = {
      locale,
      resources,
    };

    return {
      props: {
        karma: {
          auth,
          cookies,
          i18n,
        },
      },
    };
  });
};

/**
 * Function signature of `getServerSideProps`
 *
 * Enforces having `props` in return value - because if you don't, then you
 * should use `createGetServerSideProps` instead.
 */
export type GetServerSidePropsHandler<
  Props extends Record<string, unknown>,
  Query extends ParsedUrlQuery = ParsedUrlQuery
> = (
  ctx: GetServerSidePropsContext<Query>
) =>
  | Promise<{ props: Props }>
  | { props: Props }
  | { redirect: Redirect }
  | NotFound;

/**
 * the type of the result of `withKarmaSSRProps`
 */
export type WithKarmaSSRProps<Props = Record<string, unknown>> =
  | NextServerSidePropsResultWithoutProps
  | GetServerSidePropsResult<Props>;

/**
 * Higher order function to allow custom getServersideProps logic to be used
 * with KarmaSSR
 *
 * Will merge props, respects async.
 *
 * @example
 * ```js
 * export const getServerSideProps = withKarmaSSRProps((ctx) => {
 *  return {
 *    props: { title: 'next-karma' }
 *  }
 * })
 * ```
 */
export const withKarmaSSRProps = <
  Props extends Record<string, unknown>,
  Query extends ParsedUrlQuery = ParsedUrlQuery
>(
  handler: GetServerSidePropsHandler<Props, Query>,
  options?: CreateGetServerSidePropsOptions
) => {
  return async (
    ctx: GetServerSidePropsContext<Query>
  ): Promise<WithKarmaSSRProps<Props>> => {
    const handlerResult = await handler(ctx);

    if ('notFound' in handlerResult || 'redirect' in handlerResult) {
      return handlerResult;
    }

    const {
      props: { karma },
    } = await getServerSideProps(ctx, options);

    return {
      props: {
        ...handlerResult.props,
        karma,
      },
    };
  };
};
