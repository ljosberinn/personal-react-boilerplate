import type {
  GetStaticPropsResult as NextGetStaticPropsResult,
  GetStaticPropsContext,
} from 'next';
import type { ParsedUrlQuery } from 'querystring';

import { FALLBACK_LANGUAGE } from '../../constants';
import type { KarmaSSGProps } from './SSG';
import { getI18n } from './i18n';
import type { IsomorphicI18nRequirements, KarmaCoreProps } from './types';

type NextGetStaticPropsResultWithoutProps = Omit<
  NextGetStaticPropsResult<{}>,
  'props'
>;

export type GetStaticPropsResult = Promise<
  {
    props: { karma: KarmaSSGProps };
  } & NextGetStaticPropsResultWithoutProps
>;

export type CreateGetStaticPropsOptions = {
  i18n?: IsomorphicI18nRequirements & { parameterName?: string };
  auth?: Pick<
    KarmaCoreProps['auth'],
    'redirectDestinationIfUnauthenticated' | 'shouldAttemptReauthentication'
  >;
} & NextGetStaticPropsResultWithoutProps;

/**
 * @example
 * ```js
 * export const getStaticProps = createGetStaticProps({
 *   i18n: {
 *     i18nNamespaces: ['serviceWorker', 'theme'],
 *     language: 'en',
 *   },
 *   auth: {
 *     shouldAttemptReauthentication: true,
 *   },
 *   revalidate: 180
 * })
 * ```
 */
export const createGetStaticProps = (options: CreateGetStaticPropsOptions) => (
  context: GetStaticPropsContext
): GetStaticPropsResult => getStaticProps(context, options);

/**
 * only use if you don't care about loading all i18n namespaces on this route
 *
 * @see `createGetStaticProps`
 * @example
 * ```js
 * export { getStaticProps } from '../karma/client/Karma';
 * ```
 */
export const getStaticProps = async (
  ctx: GetStaticPropsContext,
  options?: CreateGetStaticPropsOptions
): GetStaticPropsResult => {
  const { auth: authOptions, i18n: i18nOptions, ...rest } = options ?? {};
  const { locale = FALLBACK_LANGUAGE } = ctx;

  const resources = await getI18n(locale, {
    namespaces: i18nOptions?.namespaces,
  });

  const i18n: KarmaSSGProps['i18n'] = {
    locale,
    resources,
  };

  const shouldAttemptReauthentication =
    authOptions?.shouldAttemptReauthentication ?? false;
  const redirectDestinationIfUnauthenticated =
    authOptions?.redirectDestinationIfUnauthenticated ?? '';

  const auth: KarmaSSGProps['auth'] = {
    redirectDestinationIfUnauthenticated,
    session: null,
    shouldAttemptReauthentication,
  };

  return {
    props: {
      karma: {
        auth,
        i18n,
      },
    },
    ...rest,
  };
};

/**
 * Function signature of `getStaticProps`
 *
 * Enforces having `props` in return value - because if you don't, then you
 * should use `createGetStaticProps` instead.
 */
export type GetStaticPropsHandler<
  Props = {},
  Query extends ParsedUrlQuery = ParsedUrlQuery
> = (
  ctx: GetStaticPropsContext<Query>
) =>
  | Promise<{ props: Props } & NextGetStaticPropsResultWithoutProps>
  | ({ props: Props } & NextGetStaticPropsResultWithoutProps);

/**
 * the type of the result of `withKarmaSSGProps`
 */
export type WithKarmaSSGProps<Props = {}> = Promise<
  {
    props: { karma: KarmaSSGProps } & Props;
  } & NextGetStaticPropsResultWithoutProps
>;

/**
 * Higher order function to allow custom getStaticProps logic to be used
 * with KarmaSSG
 *
 * Will merge props, respects async.
 *
 * `revalidate` is NOT included in options here to prevent multiple possible
 * values! Your handler should return it instead.
 *
 * @example
 * ```js
 * export const getStaticProps = withKarmaSSGProps((ctx) => {
 *  return {
 *    props: { title: 'next-karma' },
 *    revalidate: 60
 *  }
 * })
 * ```
 */
export const withKarmaSSGProps = <
  Props,
  Query extends ParsedUrlQuery = ParsedUrlQuery
>(
  handler: GetStaticPropsHandler<Props, Query>,
  options?: Omit<CreateGetStaticPropsOptions, 'revalidate'>
) => {
  return async (
    ctx: GetStaticPropsContext<Query>
  ): WithKarmaSSGProps<Props> => {
    const { props, ...rest } = await handler(ctx);
    const {
      props: { karma },
    } = await getStaticProps(ctx, options);

    return {
      props: {
        ...props,
        karma,
      },
      ...rest,
    };
  };
};
