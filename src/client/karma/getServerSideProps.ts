import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult as NextGetServerSidePropsResult,
} from 'next';
import type { ParsedUrlQuery } from 'querystring';

import { FALLBACK_LANGUAGE } from '../../constants';
import { getSession } from '../../server/auth/cookie';
import { detectLanguage } from '../../server/i18n/detectLanguage';
import { attachInitialContext } from '../../utils/sentry/client';
import { attachLambdaContext } from '../../utils/sentry/server';
import { FOUND_MOVED_TEMPORARILY } from '../../utils/statusCodes';
import type { KarmaSSRProps } from './SSR';
import { getI18n } from './i18n';
import type { IsomorphicI18nRequirements, KarmaCoreProps } from './types';

type NextGetServerSidePropsResultWithoutProps = Omit<
  NextGetServerSidePropsResult<{}>,
  'props'
>;

/**
 * Return value of `(create)GetServerSideProps` if redirecting server side.
 *
 * Only internally relevant.
 *
 * @see `getServerSideProps`
 */
type SSRRedirectPropSubset = Pick<KarmaSSRProps, 'auth'> & {
  i18n: {
    bundle: {};
    language: string;
  };
};

type GetServerSidePropsResult = Promise<{
  props: {
    karma: KarmaSSRProps | SSRRedirectPropSubset;
  } & NextGetServerSidePropsResultWithoutProps;
}>;

export type CreateGetServerSidePropsOptions = {
  i18n: IsomorphicI18nRequirements;
  auth?: Pick<KarmaCoreProps['auth'], 'redirectDestinationIfUnauthenticated'>;
} & NextGetServerSidePropsResultWithoutProps;

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
 *   revalidate: 180
 * })
 * ```
 */
export const createGetServerSideProps = (
  options: CreateGetServerSidePropsOptions
) => (context: GetServerSidePropsContext): GetServerSidePropsResult =>
  getServerSideProps(context, options);

/**
 * Redirects from `/` to the detected language, or FALLBACK_LANGUAGE if none
 * applies
 */
export const getServerSideIndexRedirect: GetServerSidePropsHandler = ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const language = detectLanguage(req);

  res.writeHead(FOUND_MOVED_TEMPORARILY, {
    Location: `/${language}`,
  });

  res.end();

  return {
    props: {},
  };
};

/**
 * only use if you don't care about loading all i18n namespaces on this route
 *
 * @see `createGetServerSideProps`
 * @example
 * ```js
 * export { getServerSideProps } from '../karma/client/Karma';
 * ```
 */
export const getServerSideProps = async (
  { req, res }: GetServerSidePropsContext,
  options?: CreateGetServerSidePropsOptions
): GetServerSidePropsResult => {
  const { i18n: i18nOptions, auth: authOptions, ...rest } = options ?? {};

  const session = getSession(req);

  if (!session && authOptions?.redirectDestinationIfUnauthenticated) {
    // client-side routing, see https://github.com/vercel/next.js/discussions/11281#discussioncomment-2384
    if (!req.headers.referer) {
      res.writeHead(FOUND_MOVED_TEMPORARILY, {
        Location: authOptions.redirectDestinationIfUnauthenticated,
      });

      res.end();
    }

    const { redirectDestinationIfUnauthenticated } = authOptions;

    return {
      props: {
        karma: {
          auth: {
            redirectDestinationIfUnauthenticated,
            session: null,
          },
          i18n: {
            bundle: {},
            language: FALLBACK_LANGUAGE,
          },
        },
      },
    };
  }

  const language = detectLanguage(req);
  const bundle = await getI18n(language, {
    namespaces: i18nOptions?.namespaces,
  });
  const cookies = req?.headers.cookie ?? '';

  attachLambdaContext(req);

  attachInitialContext({
    language,
    req,
    session,
  });

  const i18n: KarmaSSRProps['i18n'] = {
    bundle,
    language,
  };

  const auth: KarmaSSRProps['auth'] = {
    session,
  };

  return {
    props: {
      karma: {
        auth,
        cookies,
        i18n,
      },
    },
    ...rest,
  };
};

/**
 * Function signature of `getServerSideProps`
 *
 * Enforces having `props` in return value - because if you don't, then you
 * should use `createGetServerSideProps` instead.
 */
export type GetServerSidePropsHandler<
  Props = {},
  Query extends ParsedUrlQuery = ParsedUrlQuery
> = (
  ctx: GetServerSidePropsContext<Query>
) =>
  | Promise<{ props: Props } & NextGetServerSidePropsResultWithoutProps>
  | ({ props: Props } & NextGetServerSidePropsResultWithoutProps);

/**
 * the type of the result of `withKarmaSSRProps`
 */
export type WithKarmaSSRProps<Props = {}> = Promise<{
  props: { karma: KarmaSSRProps | {} } & Props;
}>;

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
  Props,
  Query extends ParsedUrlQuery = ParsedUrlQuery
>(
  handler: GetServerSidePropsHandler<Props, Query>,
  options?: CreateGetServerSidePropsOptions
) => {
  return async (
    ctx: GetServerSidePropsContext<Query>
  ): WithKarmaSSRProps<Props> => {
    const { props } = await handler(ctx);
    const {
      props: { karma },
    } = await getServerSideProps(ctx, options);

    return {
      props: {
        ...props,
        karma,
      },
    };
  };
};
