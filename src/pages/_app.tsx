import universalLanguageDetect from '@unly/universal-language-detector';
import nextCookies from 'next-cookies';
import { DefaultSeo } from 'next-seo';
import NextApp, { AppContext } from 'next/app';
import { AppTreeType, NextApiRequest } from 'next/dist/next-server/lib/utils';
import { NextRouter } from 'next/router';
import React from 'react';
import { I18nextProvider } from 'react-i18next';

import SEO from '../../next-seo.config';
import Layout from '../client/Layout';
import { ErrorBoundary } from '../client/components/common/ErrorBoundary';
import { AuthContextProvider } from '../client/context/AuthContext';
import { User } from '../client/context/AuthContext/AuthContext';
import {
  fetchTranslations,
  initI18Next,
  I18nextResourceLocale,
} from '../client/i18n';
import { ENABLED_LANGUAGES, SUPPORTED_LANGUAGES_MAP } from '../constants';
import { getSession } from '../server/auth/cookie';

/**
 * Props that are provided to the _app:getInitialProps method
 *
 * Those props are provided by Next.js framework, and we have no control over it
 */
interface AppInitialProps extends AppContext {
  AppTree: AppTreeType;
}

/**
 * Props that are returned by the main getInitialProps and then provided to the render function of the application
 *
 * The props that are being returned by getInitialProps are enhanced by the Next.js framework
 *
 * @see _app:getInitialProps - Returns it (only pageProps)
 * @see _app:render - Use it (has access to all props)
 */
export declare type AppRenderProps = {
  pageProps: {
    lang: string;
    defaultLocales: I18nextResourceLocale;
    session: User | null;
  };
  err?: Error; // Only defined if there was an error

  // XXX Props that are somehow injected by the Next.js framework between _app:getInitialProps and _app:render
  //  They're marked as optional because they aren't defined in _app:getInitialProps but will be defined in _app:render
  Component?: Function;
  router?: NextRouter;
};

export default function App({ Component, pageProps }: AppRenderProps) {
  if (!Component) {
    return null;
  }

  const i18nInstance = initI18Next(pageProps);

  return (
    <>
      <DefaultSeo {...SEO} />

      <ErrorBoundary>
        <I18nextProvider i18n={i18nInstance}>
          <AuthContextProvider session={pageProps.session}>
            <Layout>
              <Component />
            </Layout>
          </AuthContextProvider>
        </I18nextProvider>
      </ErrorBoundary>
    </>
  );
}

App.getInitialProps = async function (
  props: AppInitialProps
): Promise<AppRenderProps> {
  const { ctx } = props;
  const { req } = ctx;

  /* i18n start */
  const lang = universalLanguageDetect({
    supportedLanguages: ENABLED_LANGUAGES,
    fallbackLanguage: SUPPORTED_LANGUAGES_MAP.en,
    acceptLanguageHeader: req?.headers['accept-language'],
    serverCookies: nextCookies(ctx),
  });

  const defaultLocales = await fetchTranslations(lang, req);
  /* i18n end */

  /* auth start */
  const session = await getSession((req as unknown) as NextApiRequest);
  /* auth end */

  const appProps: AppRenderProps = await NextApp.getInitialProps(props);

  return { ...appProps, pageProps: { defaultLocales, lang, session } };
};
