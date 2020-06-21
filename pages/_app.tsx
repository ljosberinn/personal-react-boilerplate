import { DefaultSeo } from 'next-seo';
import NextApp, { AppContext } from 'next/app';
import { NextRouter } from 'next/router';
import React from 'react';
import { I18nextProvider } from 'react-i18next';

import SEO from '../next-seo.config';
import Chakra from '../src/client/Chakra';
// import { CustomPWAInstallPrompt } from '../src/client/components/common/CustomPWAInstallPrompt';
import { ErrorBoundary as TopLevelErrorBoundary } from '../src/client/components/common/ErrorBoundary';
import ServiceWorker from '../src/client/components/common/ServiceWorker/ServiceWorker';
import { AuthContextProvider } from '../src/client/context/AuthContext';
import { User } from '../src/client/context/AuthContext/AuthContext';
import {
  I18nextResourceLocale,
  initI18Next,
  getI18N,
  detectLanguage,
} from '../src/client/i18n';
import { getSession } from '../src/server/auth/cookie';
import {
  attachInitialContext,
  attachRoutingContext,
} from '../src/utils/sentry';

export interface PageProps {
  language: string;
  i18nBundle: I18nextResourceLocale;
  session: User | null;
}

export interface AppRenderProps {
  pageProps: PageProps;
  err?: Error;
  Component?: Function;
  router?: NextRouter;
}

export default function App({ Component, pageProps, router }: AppRenderProps) {
  if (!Component) {
    return null;
  }

  if (router) {
    attachRoutingContext(router, Component.name);
  }

  const i18nInstance = initI18Next(pageProps);

  return (
    <>
      <DefaultSeo {...SEO} />

      <TopLevelErrorBoundary>
        <I18nextProvider i18n={i18nInstance}>
          <AuthContextProvider session={pageProps.session}>
            <Chakra>
              <ServiceWorker />
              {/* <CustomPWAInstallPrompt /> */}
              <Component {...pageProps} />
            </Chakra>
          </AuthContextProvider>
        </I18nextProvider>
      </TopLevelErrorBoundary>
    </>
  );
}

App.getInitialProps = async function (
  props: AppContext
): Promise<AppRenderProps> {
  const {
    ctx,
    Component: { getInitialProps },
  } = props;

  const session = await getSession(ctx.req);

  const language = detectLanguage(ctx);
  const i18nBundle = await getI18N(language, ctx.req);

  const appProps: AppRenderProps = await NextApp.getInitialProps(props);

  attachInitialContext({ language, req: props.ctx.req, session });

  // return {
  //   ...appProps,
  //   pageProps: {
  //     i18nBundle,
  //     language,
  //     session,
  //   },
  // };

  /*
   * Uncomment these lines as well as the destructuring above to disable support
   * for subcomponent `getInitialProps` if you dont need it.
   *
   * It's currently required for the custom _error & _document page.
   *
   * @see https://nextjs.org/docs/api-reference/data-fetching/getInitialProps
   */

  const componentPageProps = getInitialProps ? await getInitialProps(ctx) : {};

  return {
    ...appProps,
    pageProps: {
      i18nBundle,
      language,
      session,
      ...componentPageProps,
    },
  };
};
