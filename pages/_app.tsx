import universalLanguageDetect from '@unly/universal-language-detector';
import NextCookies from 'next-cookies';
import NextApp, { AppContext } from 'next/app';
import { AppTreeType, NextPageContext } from 'next/dist/next-server/lib/utils';
import { NextRouter } from 'next/router';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import {
  I18nextResources,
  fetchTranslations,
  initI18Next,
  defaultNamespace,
} from 'src/client/i18n';
import { ENABLED_LANGUAGES, SUPPORTED_LANGUAGES_MAP } from 'src/constants';

import Layout from '../src/client/Layout';
import { ErrorBoundary } from '../src/client/common/ErrorBoundary';

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
 * Also, our HOC apply at the same moment and enhance even more the properties that the render function will receive
 *
 * @see _app:getInitialProps - Returns it (only pageProps)
 * @see _app:render - Use it (has access to all props)
 */
export declare type AppRenderProps = {
  pageProps: {
    headers: {
      'accept-language'?: string;
      'user-agent'?: string;
      host?: string;
    }; // Headers made public to the client-side
    bestCountryCodes: string[];
    lang: string;
    defaultLocales: I18nextResources;
  };
  err?: Error; // Only defined if there was an error

  // XXX Props that are somehow injected by the Next.js framework between _app:getInitialProps and _app:render
  //  They're marked as optional because they aren't defined in _app:getInitialProps but will be defined in _app:render
  Component?: Function; // eslint-disable-line @typescript-eslint/no-explicit-any
  router?: NextRouter;
};

export default class App extends NextApp {
  static async getInitialProps(
    props: AppInitialProps
  ): Promise<AppRenderProps> {
    const { ctx }: AppInitialProps = props;
    const { req }: NextPageContext = ctx;

    const appProps: AppRenderProps = await NextApp.getInitialProps(props);

    const readonlyCookies = NextCookies(ctx); // Parses Next.js cookies in a universal way (server + client)

    const lang = universalLanguageDetect({
      supportedLanguages: ENABLED_LANGUAGES,
      fallbackLanguage: SUPPORTED_LANGUAGES_MAP.en,
      acceptLanguageHeader: req?.headers['accept-language'],
      serverCookies: readonlyCookies,
    });

    const defaultLocales = {
      [lang]: {
        [defaultNamespace]: await fetchTranslations(lang),
      },
    };

    appProps.pageProps = {
      bestCountryCodes: [
        lang,
        lang === SUPPORTED_LANGUAGES_MAP.en
          ? SUPPORTED_LANGUAGES_MAP.de
          : SUPPORTED_LANGUAGES_MAP.en,
      ],
      defaultLocales,
      lang,
      headers: {},
    };

    return {
      ...appProps,
    };
  }

  render() {
    const { Component, pageProps } = this.props;

    const i18nInstance = initI18Next(pageProps.lang, pageProps.defaultLocales);

    return (
      <ErrorBoundary>
        <I18nextProvider i18n={i18nInstance}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </I18nextProvider>
      </ErrorBoundary>
    );
  }
}
