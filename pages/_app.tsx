import { DefaultSeo } from 'next-seo';
import NextApp, { AppContext } from 'next/app';
import { NextRouter } from 'next/router';
import React from 'react';
import { I18nextProvider } from 'react-i18next';

import SEO from '../next-seo.config';
import Layout from '../src/client/Layout';
import { ErrorBoundary } from '../src/client/components/common/ErrorBoundary';
import { AuthContextProvider } from '../src/client/context/AuthContext';
import { User } from '../src/client/context/AuthContext/AuthContext';
import {
  I18nextResourceLocale,
  detectAndGetTranslation,
  initI18Next,
} from '../src/client/i18n';
import { getSession } from '../src/server/auth/cookie';

export type AppRenderProps = {
  pageProps: {
    lang: string;
    defaultLocales: I18nextResourceLocale;
    session: User | null;
  };
  err?: Error;
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
              <Component {...pageProps} />
            </Layout>
          </AuthContextProvider>
        </I18nextProvider>
      </ErrorBoundary>
    </>
  );
}

App.getInitialProps = async function (
  props: AppContext
): Promise<AppRenderProps> {
  const {
    ctx,
    // Component : { getInitialProps } ,
  } = props;

  const session = await getSession(ctx.req);

  const { lang, defaultLocales } = await detectAndGetTranslation(ctx);

  const appProps: AppRenderProps = await NextApp.getInitialProps(props);

  return {
    ...appProps,
    pageProps: {
      defaultLocales,
      lang,
      session,
    },
  };

  /*
   * Uncomment these lines as well as the one above to enable support for
   * subcomponent `getInitialProps` if you really need it
   *
   * @see https://nextjs.org/docs/api-reference/data-fetching/getInitialProps
   */

  // const componentPageProps = getInitialProps ? await getInitialProps(ctx) : {};

  // const defaultPageProps = { defaultLocales, lang, session };

  // return {
  //   ...appProps,
  //   pageProps: { ...defaultPageProps, ...componentPageProps },
  // };
};
