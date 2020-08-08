import { ChakraProvider, cookieStorageManager } from '@chakra-ui/core';
import theme from '@chakra-ui/theme';
import { GetServerSidePropsContext } from 'next';
import React, { useEffect } from 'react';
import { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';

import { IS_BROWSER } from '../constants';
import { getSession } from '../server/auth/cookie';
import { attachInitialContext } from '../utils/sentry/client';
import { MetaThemeColorSynchronizer } from './components/common/MetaThemeColorSynchronizer';
import { ServiceWorker } from './components/common/ServiceWorker';
import { AuthContextProvider } from './context/AuthContext';
import { User } from './context/AuthContext/AuthContext';
import {
  I18nextResourceLocale,
  initI18Next,
  getI18N,
  detectLanguage,
} from './i18n';

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

  useEffect(() => {
    if (IS_BROWSER) {
      document.querySelector('html')?.setAttribute('lang', language);
    }
  }, [language]);

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
          {/* <CustomPWAInstallPrompt /> */}
          {children}
        </ChakraProvider>
      </AuthContextProvider>
    </I18nextProvider>
  );
}

type getServerSidePropsReturn = Promise<{
  props: { karma: Omit<KarmaProps, 'children'> };
}>;

export type GetServerSidePropsHandler = <T extends { props: object }>(
  ctx: GetServerSidePropsContext
) => Promise<T> | T;

/**
 *
 */
export function withServerSideProps(fn: GetServerSidePropsHandler) {
  return async (ctx: GetServerSidePropsContext) => {
    const { props } = await fn(ctx);
    const karma = await getServerSideProps(ctx);

    return {
      props: {
        ...props,
        karma,
      },
    };
  };
}

export async function getServerSideProps(
  ctx: GetServerSidePropsContext
): getServerSidePropsReturn {
  const session = getSession(ctx.req);
  const language = detectLanguage(ctx);
  const i18nBundle = await getI18N(language, ctx);
  const cookies = ctx.req.headers.cookie ?? '';

  attachInitialContext({
    language,
    req: ctx.req,
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
