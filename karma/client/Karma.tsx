import { ChakraProvider, theme } from '@chakra-ui/core';
import type { GetServerSidePropsContext } from 'next';
import type { ParsedUrlQuery } from 'querystring';
import type { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';

import type { Namespace } from '../../src/constants';
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
import { initI18Next, getI18n } from './i18n';

export interface KarmaProps {
  language: string;
  i18nBundle: I18nextResourceLocale;
  session: User | null;
}

export interface WithChildren {
  children: ReactNode;
}

export interface WithKarma extends WithChildren {
  karma: KarmaProps;
}

export function KarmaProvider({
  session,
  i18nBundle,
  language,
  children,
}: KarmaProps & WithChildren): JSX.Element {
  const i18nInstance = initI18Next({ i18nBundle, language });

  attachComponentBreadcrumb('KarmaProvider');

  return (
    <I18nextProvider i18n={i18nInstance}>
      <AuthContextProvider session={session}>
        <ChakraProvider theme={theme} portalZIndex={40} resetCSS>
          <ServiceWorker />
          <MetaThemeColorSynchronizer />
          {/* <CustomPWAInstallPrompt /> */}
          {children}
        </ChakraProvider>
      </AuthContextProvider>
    </I18nextProvider>
  );
}

export type WithServerSideKarmaProps<Props> = Promise<{
  props: { karma: KarmaProps } & Props;
}>;

export type GetServerSidePropsHandler<
  Props = {},
  Query extends ParsedUrlQuery = ParsedUrlQuery
> = (
  ctx: GetServerSidePropsContext<Query>
) => Promise<{ props: Props }> | { props: Props };

export const withServerSideKarmaProps = <
  Props,
  Query extends ParsedUrlQuery = ParsedUrlQuery
>(
  fn: GetServerSidePropsHandler<Props, Query>,
  options?: CreateGetServerSidePropsOptions
) => {
  return async (
    ctx: GetServerSidePropsContext<Query>
  ): WithServerSideKarmaProps<Props> => {
    const { props } = await fn(ctx);
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
  props: { karma: Omit<KarmaProps, 'children'> };
}>;

export interface CreateGetServerSidePropsOptions {
  i18nNamespaces: Namespace[];
}

export const createGetServerSideProps = (
  options: CreateGetServerSidePropsOptions
) => (context: GetServerSidePropsContext): GetServerSidePropsReturn =>
  getServerSideProps(context, options);

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
