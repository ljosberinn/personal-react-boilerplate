/* eslint-disable spaced-comment */
import { ChakraProvider, theme } from '@chakra-ui/core';
import type {
  GetServerSidePropsContext,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import type { ParsedUrlQuery } from 'querystring';
import type { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';

import type { Namespace } from '../../src/constants';
import { FALLBACK_LANGUAGE } from '../../src/constants';
import { getSession } from '../server/auth/cookie';
import { detectLanguage } from '../server/i18n/detectLanguage';
import {
  attachComponentBreadcrumb,
  attachInitialContext,
} from '../utils/sentry/client';
import { attachLambdaContext } from '../utils/sentry/server';
import { MetaThemeColorSynchronizer } from './components/MetaThemeColorSynchronizer';
import { ServiceWorker } from './components/ServiceWorker';
import { AuthContextProvider } from './context/AuthContext';
import type { User } from './context/AuthContext/AuthContext';
import type { I18nextResourceLocale } from './i18n';
import { initI18Next, getI18n, getStaticI18n } from './i18n';

export interface WithChildren {
  children: ReactNode;
}

/**********************
 * KarmaCore
 *********************/

export interface KarmaCoreProps {
  language: string;
  i18nBundle: I18nextResourceLocale | Partial<I18nextResourceLocale>;
}

function KarmaCore({
  i18nBundle,
  language,
  children,
}: KarmaCoreProps & WithChildren): JSX.Element {
  const i18nInstance = initI18Next({ i18nBundle, language });

  attachComponentBreadcrumb('KarmaCore');

  return (
    <I18nextProvider i18n={i18nInstance}>
      <ChakraProvider theme={theme} portalZIndex={40} resetCSS>
        <ServiceWorker />
        <MetaThemeColorSynchronizer />
        {/* <CustomPWAInstallPrompt /> */}
        {children}
      </ChakraProvider>
    </I18nextProvider>
  );
}

/**********************
 * KarmaSSG
 *********************/

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface KarmaSSGProps extends KarmaCoreProps {}

export const KarmaSSG = KarmaCore;

/**********************
 * KarmaSSR
 *********************/

export interface KarmaSSRProps extends KarmaCoreProps {
  session: User | null;
}

export function KarmaSSR({
  session,
  children,
  ...rest
}: KarmaSSRProps & WithChildren): JSX.Element {
  attachComponentBreadcrumb('KarmaSSR');

  return (
    <AuthContextProvider session={session}>
      <KarmaSSG {...rest}>{children}</KarmaSSG>
    </AuthContextProvider>
  );
}

/**********************
 * shared utils
 *********************/
/**
 * component props including karma props.
 *
 * use in combination with `KarmaSSRProps` or `KarmaSSGProps`
 *
 * @see `KarmaSSRProps`
 * @see `KarmaSSGProps`
 */
export type WithKarmaProps<KarmaProps, Props = {}> = {
  karma: KarmaProps;
} & Props;

/**********************
 * getServerSideProps + utils
 *********************/

/**
 * Function signature of `getServerSideProps`
 */
export type GetServerSidePropsHandler<
  Props = {},
  Query extends ParsedUrlQuery = ParsedUrlQuery
> = (
  ctx: GetServerSidePropsContext<Query>
) => Promise<{ props: Props }> | { props: Props };

/**
 * the type of the result of `withKarmaSSRProps`
 */
export type WithKarmaSSRProps<Props = {}> = Promise<{
  props: { karma: KarmaSSRProps } & Props;
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

type GetServerSidePropsReturn = Promise<{
  props: { karma: KarmaSSRProps };
}>;

export interface CreateGetServerSidePropsOptions {
  i18nNamespaces: Namespace[];
}

export const createGetServerSideProps = (
  options: CreateGetServerSidePropsOptions
) => (context: GetServerSidePropsContext): GetServerSidePropsReturn =>
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
export const getServerSideProps = async (
  { req }: GetServerSidePropsContext,
  options?: CreateGetServerSidePropsOptions
): GetServerSidePropsReturn => {
  const session = getSession(req);
  const language = detectLanguage(req);
  const i18nBundle = await getI18n(language, {
    namespaces: options?.i18nNamespaces,
    req,
  });

  attachLambdaContext(req);

  attachInitialContext({
    language,
    req,
    session,
  });

  return {
    props: {
      karma: {
        i18nBundle,
        language,
        session,
      },
    },
  };
};

/**********************
 * getStaticProps + utils
 *********************/

type Revalidate = GetStaticPropsResult<{}>['revalidate'];

export type GetStaticPropsReturn = Promise<{
  props: { karma: KarmaSSGProps };
  revalidate?: Revalidate;
}>;

export type CreateGetStaticPropsOptions = {
  i18nNamespaces: Namespace[];
  language?: string;
  revalidate?: Revalidate;
};

/**
 * @example
 * ```js
 * export const getStaticProps = createGetStaticProps({
 *  i18nNamespaces: ['serviceWorker', 'theme'],
 *  language: 'jp',
 *  revalidate: 180
 * })
 * ```
 */
export const createGetStaticProps = (options: CreateGetStaticPropsOptions) => (
  context: GetStaticPropsContext
): GetStaticPropsReturn => getStaticProps(context, options);

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
  // @ts-expect-error ignore for now, here to preserve syntax and might be needed later
  ctx: GetStaticPropsContext,
  options?: CreateGetStaticPropsOptions
): GetStaticPropsReturn => {
  const language = options?.language ?? FALLBACK_LANGUAGE;

  const i18nBundle = await getStaticI18n(language, {
    namespaces: options?.i18nNamespaces,
  });

  return {
    props: {
      karma: {
        i18nBundle,
        language,
      },
    },
    revalidate: options?.revalidate,
  };
};

/**
 * Function signature of `getStaticProps`
 */
export type GetStaticPropsHandler<
  Props = {},
  Query extends ParsedUrlQuery = ParsedUrlQuery
> = (
  ctx: GetStaticPropsContext<Query>
) =>
  | Promise<{ props: Props; revalidate?: Revalidate }>
  | { props: Props; revalidate?: Revalidate };

/**
 * the type of the result of `withKarmaSSGProps`
 */
export type WithKarmaSSGProps<Props = {}> = Promise<{
  props: { karma: KarmaSSGProps } & Props;
  revalidate?: Revalidate;
}>;

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
    const { props, revalidate } = await handler(ctx);
    const {
      props: { karma },
    } = await getStaticProps(ctx, options);

    return {
      props: {
        ...props,
        karma,
      },
      revalidate,
    };
  };
};
