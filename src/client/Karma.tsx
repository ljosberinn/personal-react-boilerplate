import { ChakraProvider, cookieStorageManager } from '@chakra-ui/core';
import theme from '@chakra-ui/theme';
import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import React from 'react';
import { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';

import { getSession } from '../server/auth/cookie';
import { detectLanguage } from '../server/i18n/detectLanguage';
import {
  attachComponentBreadcrumb,
  attachInitialContext,
} from '../utils/sentry/client';
import { HtmlLangAttrSynchronizer } from './components/common/HtmlLangAttrSynchronizer';
import { MetaThemeColorSynchronizer } from './components/common/MetaThemeColorSynchronizer';
import { ServiceWorker } from './components/common/ServiceWorker';
import { AuthContextProvider } from './context/AuthContext';
import { User } from './context/AuthContext/AuthContext';
import { I18nextResourceLocale, initI18Next, getI18N } from './i18n';

export interface KarmaProps {
  language: string;
  i18nBundle: I18nextResourceLocale;
  session: User | null;
  cookies: string;
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
  cookies,
  children,
}: KarmaProps & WithChildren) {
  const i18nInstance = initI18Next({ i18nBundle, language });

  attachComponentBreadcrumb('KarmaProvider');

  return (
    <I18nextProvider i18n={i18nInstance}>
      <AuthContextProvider session={session}>
        <ServiceWorker />
        <ChakraProvider
          theme={theme}
          portalConfig={{ zIndex: 40 }}
          resetCSS
          storageManager={cookieStorageManager(cookies)}
        >
          <MetaThemeColorSynchronizer />
          <HtmlLangAttrSynchronizer />
          {/* <CustomPWAInstallPrompt /> */}
          {children}
        </ChakraProvider>
      </AuthContextProvider>
    </I18nextProvider>
  );
}

export type WithServerSideKarmaProps<T> = Promise<{
  props: { karma: KarmaProps } & T;
}>;

export type GetServerSidePropsHandler<
  T = {},
  Q extends ParsedUrlQuery = ParsedUrlQuery
> = (ctx: GetServerSidePropsContext<Q>) => Promise<{ props: T }> | { props: T };

/**
 *
 */
export function withServerSideProps<
  T,
  Q extends ParsedUrlQuery = ParsedUrlQuery
>(fn: GetServerSidePropsHandler<T, Q>) {
  return async (
    ctx: GetServerSidePropsContext<Q>
  ): WithServerSideKarmaProps<T> => {
    const { props } = await fn(ctx);
    const {
      props: { karma },
    } = await getServerSideProps(ctx);

    return {
      props: {
        ...props,
        karma,
      },
    };
  };
}

type getServerSidePropsReturn = Promise<{
  props: { karma: Omit<KarmaProps, 'children'> };
}>;

export async function getServerSideProps({
  req,
}: GetServerSidePropsContext): getServerSidePropsReturn {
  const session = getSession(req);
  const language = detectLanguage(req);
  const i18nBundle = await getI18N(language, req);
  const cookies = req.headers.cookie ?? '';

  attachInitialContext({
    language,
    req,
    session,
  });

  return {
    props: {
      karma: {
        cookies,
        i18nBundle,
        language,
        session,
      },
    },
  };
}
