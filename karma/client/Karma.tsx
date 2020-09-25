/* eslint-disable spaced-comment */
import type { StorageManager } from '@chakra-ui/core';
import { localStorageManager, ChakraProvider } from '@chakra-ui/core';
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

export type Mode = 'ssr' | 'ssg';

export interface KarmaCoreProps {
  i18n: {
    /**
     * The language to initialize i18n with
     */
    language: string;
    /**
     * The initial bundle to initialize i18n with
     */
    bundle: I18nextResourceLocale | Partial<I18nextResourceLocale>;
  };

  /**
   * Optional Chakra StorageManager taking care of color mode persistence
   *
   * @default undefined
   */
  storageManager?: StorageManager;
  session: User | null;
  mode: Mode;
}

function KarmaCore({
  i18n,
  storageManager,
  session,
  mode,
  children,
}: KarmaCoreProps & WithChildren): JSX.Element {
  const i18nInstance = initI18Next(i18n);

  attachComponentBreadcrumb('KarmaCore');

  return (
    <AuthContextProvider mode={mode} session={session}>
      <I18nextProvider i18n={i18nInstance}>
        <ChakraProvider portalZIndex={40} colorModeManager={storageManager}>
          <ServiceWorker />
          <MetaThemeColorSynchronizer />
          {/* <CustomPWAInstallPrompt /> */}
          {children}
        </ChakraProvider>
      </I18nextProvider>
    </AuthContextProvider>
  );
}

/**********************
 * KarmaSSG
 *********************/

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface KarmaSSGProps extends Omit<KarmaCoreProps, 'mode'> {}

export function KarmaSSG({
  children,
  ...rest
}: KarmaSSGProps & WithChildren): JSX.Element {
  attachComponentBreadcrumb('KarmaSSG');

  return (
    <KarmaCore {...rest} mode="ssg">
      {children}
    </KarmaCore>
  );
}

/**********************
 * KarmaSSR
 *********************/

export interface KarmaSSRProps extends Omit<KarmaCoreProps, 'mode'> {
  cookies: string;
}

export function KarmaSSR({
  children,
  cookies,
  ...rest
}: KarmaSSRProps & WithChildren): JSX.Element {
  attachComponentBreadcrumb('KarmaSSR');

  // TODO: use cookieStorageManager with rc5
  const storageManager = localStorageManager; //cookieStorageManager(cookies);

  return (
    <KarmaCore {...rest} storageManager={storageManager} mode="ssr">
      {children}
    </KarmaCore>
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
  const bundle = await getI18n(language, {
    namespaces: options?.i18nNamespaces,
    req,
  });
  const cookies = req?.headers.cookie ?? '';

  attachLambdaContext(req);

  attachInitialContext({
    language,
    req,
    session,
  });

  const i18n = {
    bundle,
    language,
  };

  return {
    props: {
      karma: {
        cookies,
        i18n,
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

  const bundle = await getStaticI18n(language, {
    namespaces: options?.i18nNamespaces,
  });

  const i18n = {
    bundle,
    language,
  };

  return {
    props: {
      karma: {
        i18n,
        session: null,
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
