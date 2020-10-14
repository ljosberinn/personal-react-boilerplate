/* eslint-disable spaced-comment */
import type { ChakraProviderProps, StorageManager } from '@chakra-ui/core';
import { cookieStorageManager, ChakraProvider } from '@chakra-ui/core';
import type {
  GetServerSidePropsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
  NextComponentType,
  NextPageContext,
} from 'next';
import { useRouter } from 'next/router';
import type { ParsedUrlQuery } from 'querystring';
import type { ReactNode, ReactElement } from 'react';
import { useEffect, isValidElement } from 'react';
import { I18nextProvider } from 'react-i18next';

import { MetaThemeColorSynchronizer } from '../../src/client/components/MetaThemeColorSynchronizer';
import { AuthContextProvider } from '../../src/client/context/AuthContext';
import type { User } from '../../src/client/context/AuthContext/AuthContext';
import type { Namespace } from '../../src/constants';
import {
  ENABLED_LANGUAGES,
  FALLBACK_LANGUAGE,
  DEFAULT_DYNAMIC_ROUTE_I18N_FOLDER_NAME,
} from '../../src/constants';
import { getSession } from '../server/auth/cookie';
import { detectLanguage } from '../server/i18n/detectLanguage';
import {
  attachComponentBreadcrumb,
  attachInitialContext,
} from '../utils/sentry/client';
import { attachLambdaContext } from '../utils/sentry/server';
import { FOUND_MOVED_TEMPORARILY } from '../utils/statusCodes';
import { ServiceWorker } from './components/ServiceWorker';
import type { I18nextResourceLocale } from './i18n';
import { initI18Next, getI18n } from './i18n';

export type WithChildren<Props = {}> = Props & {
  children: ReactNode;
};

/**********************
 * withLayout support
 *********************/

/**
 * Patched `NextComponentType` to support `.withLayout function in `_app`
 *
 * @see https://adamwathan.me/2019/10/17/persistent-layout-patterns-in-nextjs/
 */
export type NextComponentWithKarma = NextComponentType<
  NextPageContext,
  object,
  object
> & {
  withLayout?: WithLayoutHandler;
};

export type WithLayoutHandler = (page: ReactElement) => JSX.Element;

export const layoutPassthrough: WithLayoutHandler = (page) => page;

export const getKarmaWrap = (karmaProps?: KarmaSSGProps | KarmaSSRProps) => {
  return function IsomorphicKarma({
    children,
  }: WithChildren): JSX.Element | ReactElement | null {
    if (karmaProps) {
      if ('cookies' in karmaProps) {
        return <KarmaSSR {...karmaProps}>{children}</KarmaSSR>;
      }

      return <KarmaSSG {...karmaProps}>{children}</KarmaSSG>;
    }

    return isValidElement(children) ? children : null;
  };
};

/**********************
 * KarmaCore
 *********************/

export type KarmaMode = 'ssr' | 'ssg';

type IsomorphicI18nRequirements = {
  language?: string;
  namespaces?: Namespace[];
};

export type KarmaCoreProps = {
  /**
   * props forwarded onto `ChakraProvider`
   */
  chakra?: Omit<ChakraProviderProps, 'colorModeManager' | 'children'>;

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

  auth: {
    /**
     * The session to initialize a render with
     */
    session: User | null;
    /**
     * Whether to attempt to re-authenticate a user on a SSG'd page
     *
     * @default false
     */
    shouldAttemptReauthentication?: boolean;
    /**
     * Redirects to given URL if re-authentication failed
     *
     * @default undefined
     */
    redirectDestinationIfUnauthenticated?: string;
  };

  /**
   * Chakras colorModeManager taking care of color mode persistence
   * managed by Karma
   *
   * @default undefined
   */
  colorModeManager?: StorageManager;

  /**
   * internal indicator which mode we're rendering in
   */
  mode: KarmaMode;
};

function KarmaCore({
  i18n,
  colorModeManager,
  auth,
  mode,
  chakra,
  children,
}: KarmaCoreProps & WithChildren): JSX.Element {
  const i18nInstance = initI18Next(i18n);

  attachComponentBreadcrumb('KarmaCore');

  return (
    <AuthContextProvider {...auth} mode={mode}>
      <I18nextProvider i18n={i18nInstance}>
        <ChakraProvider {...chakra} colorModeManager={colorModeManager}>
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

export type KarmaSSGProps = Omit<KarmaCoreProps, 'mode'>;

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

export type KarmaSSRProps = Omit<KarmaCoreProps, 'mode'> & {
  cookies: string;
};

export function KarmaSSR({
  children,
  cookies,
  ...rest
}: KarmaSSRProps & WithChildren): JSX.Element | null {
  attachComponentBreadcrumb('KarmaSSR');

  const shouldRedirect = useDetermineShouldRedirect(rest.auth);

  if (shouldRedirect) {
    return null;
  }

  const colorModeManager = cookieStorageManager(cookies);

  return (
    <KarmaCore {...rest} colorModeManager={colorModeManager} mode="ssr">
      {children}
    </KarmaCore>
  );
}

type UsePseudoSSRRedirectArgs = KarmaSSRProps['auth'];

/**
 * relatively ugly workaround for redirecting client side when navigation
 * to a protected/redirecting site without session occurs
 *
 * @see https://github.com/vercel/next.js/discussions/11281#discussioncomment-2384
 */
function useDetermineShouldRedirect({
  redirectDestinationIfUnauthenticated,
  session,
}: UsePseudoSSRRedirectArgs): boolean {
  const { replace } = useRouter();
  /**
   * redirect if:
   *
   * - no `session` present
   * - `redirectDestinationIfUnauthenticated` is given
   */
  const shouldRedirect = !session && !!redirectDestinationIfUnauthenticated;

  useEffect(() => {
    if (!shouldRedirect || !redirectDestinationIfUnauthenticated) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      try {
        await replace(redirectDestinationIfUnauthenticated);
      } catch {
        window.location.assign(redirectDestinationIfUnauthenticated);
      }
    })();
  }, [shouldRedirect, redirectDestinationIfUnauthenticated, replace]);

  return shouldRedirect;
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

type SSRRedirectPropSubset = Pick<KarmaSSRProps, 'auth'> & {
  i18n: {
    bundle: {};
    language: string;
  };
};

type GetServerSidePropsReturn = Promise<{
  props: { karma: KarmaSSRProps | SSRRedirectPropSubset };
}>;

export type CreateGetServerSidePropsOptions = {
  i18n: IsomorphicI18nRequirements;
  auth?: Pick<KarmaCoreProps['auth'], 'redirectDestinationIfUnauthenticated'>;
};

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
  { req, res }: GetServerSidePropsContext,
  options?: CreateGetServerSidePropsOptions
): GetServerSidePropsReturn => {
  const session = getSession(req);

  if (!session && options?.auth?.redirectDestinationIfUnauthenticated) {
    // client-side routing, see https://github.com/vercel/next.js/discussions/11281#discussioncomment-2384
    if (!req.headers.referer) {
      res.writeHead(FOUND_MOVED_TEMPORARILY, {
        Location: options.auth.redirectDestinationIfUnauthenticated,
      });

      res.end();
    }

    const { redirectDestinationIfUnauthenticated } = options.auth;

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
    namespaces: options?.i18n.namespaces,
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
  };
};

/**
 * Redirects from `/` to
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

/**********************
 * getStaticProps + utils
 *********************/

type Revalidate = GetStaticPropsResult<{}>['revalidate'];

export type GetStaticPropsReturn = Promise<{
  props: { karma: KarmaSSGProps };
  revalidate?: Revalidate;
}>;

export type CreateGetStaticPropsOptions = {
  i18n?: IsomorphicI18nRequirements & { parameterName?: string };
  auth?: Pick<
    KarmaCoreProps['auth'],
    'redirectDestinationIfUnauthenticated' | 'shouldAttemptReauthentication'
  >;
  revalidate?: Revalidate;
};

/**
 * @example
 * ```js
 * export const getStaticProps = createGetStaticProps({
 *   i18n: {
 *     i18nNamespaces: ['serviceWorker', 'theme'],
 *     language: 'jp',
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
): GetStaticPropsReturn => getStaticProps(context, options);

const determinPreferredStaticLanguage = (
  { params }: GetStaticPropsContext,
  options?: CreateGetStaticPropsOptions
): string => {
  // prefer explicitly declared language
  if (options?.i18n?.language) {
    return options.i18n.language;
  }

  // parse static params if present
  const i18nDynamicLanguageName =
    options?.i18n?.parameterName ?? DEFAULT_DYNAMIC_ROUTE_I18N_FOLDER_NAME;
  const languageViaParameter = params?.[i18nDynamicLanguageName];

  /* istanbul ignore next */
  if (languageViaParameter && !Array.isArray(languageViaParameter)) {
    return languageViaParameter;
  }

  return FALLBACK_LANGUAGE;
};

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
): GetStaticPropsReturn => {
  const language = determinPreferredStaticLanguage(ctx, options);
  const bundle = await getI18n(language, {
    namespaces: options?.i18n?.namespaces,
  });

  const i18n: KarmaSSGProps['i18n'] = {
    bundle,
    language,
  };

  const shouldAttemptReauthentication =
    options?.auth?.shouldAttemptReauthentication ?? false;
  const redirectDestinationIfUnauthenticated =
    options?.auth?.redirectDestinationIfUnauthenticated ?? '';

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
