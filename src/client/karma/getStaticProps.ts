import type {
  GetStaticPropsResult as NextGetStaticPropsResult,
  GetStaticPropsContext,
  GetStaticPathsResult,
} from 'next';
import type { ParsedUrlQuery } from 'querystring';

import {
  DEFAULT_DYNAMIC_ROUTE_I18N_FOLDER_NAME,
  FALLBACK_LANGUAGE,
  ENABLED_LANGUAGES,
} from '../../constants';
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

type CreateStaticI18nPathsArgs = {
  parameterName?: string;
};

/**
 * creates a `getStaticPaths` handler to be used in `/pages/[locale]/index`
 * with the possibility to change the parameter name should you wish to rename
 * `[locale]` to something else
 *
 * @example
 * ```js
 * export const getStaticPaths = createStaticI18nPaths()
 * // with renamed folder
 * export const getStaticPaths = createStaticI18nPaths({ parameterName: 'lang' })
 * ```
 */
export const createStaticI18nPaths = ({
  parameterName = DEFAULT_DYNAMIC_ROUTE_I18N_FOLDER_NAME,
}: CreateStaticI18nPathsArgs = {}) => (): GetStaticPathsResult => ({
  fallback: false,
  paths: ENABLED_LANGUAGES.map((language) => ({
    params: { [parameterName]: language },
  })),
});

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

  const language = determinPreferredStaticLanguage(ctx, i18nOptions);
  const bundle = await getI18n(language, {
    namespaces: i18nOptions?.namespaces,
  });

  const i18n: KarmaSSGProps['i18n'] = {
    bundle,
    language,
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

const determinPreferredStaticLanguage = (
  { params }: GetStaticPropsContext,
  i18n?: CreateGetStaticPropsOptions['i18n']
): string => {
  // prefer explicitly declared language
  if (i18n?.language) {
    return i18n.language;
  }

  // parse static params if present
  const i18nDynamicLanguageName =
    i18n?.parameterName ?? DEFAULT_DYNAMIC_ROUTE_I18N_FOLDER_NAME;
  const languageViaParameter = params?.[i18nDynamicLanguageName];

  /* istanbul ignore next */
  if (languageViaParameter && !Array.isArray(languageViaParameter)) {
    return languageViaParameter;
  }

  return FALLBACK_LANGUAGE;
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
