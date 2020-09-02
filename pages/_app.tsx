import type { NextComponentType, NextPageContext } from 'next';
import type { NextWebVitalsMetric } from 'next/app';
import Head from 'next/head';
import type { NextRouter } from 'next/router';

import {
  attachRoutingContext,
  ErrorBoundary as TopLevelErrorBoundary,
  configureScope,
} from '../karma/utils/sentry/client';

export interface AppRenderProps {
  pageProps: object;
  err?: Error;
  Component?: NextComponentType<NextPageContext, AppRenderProps, object>;
  router?: NextRouter;
}

// eslint-disable-next-line import/no-default-export
export default function App({
  Component,
  pageProps,
  router,
}: AppRenderProps): JSX.Element | null {
  if (!Component) {
    return null;
  }

  if (router) {
    attachRoutingContext(router, Component.name);
  }

  return (
    <>
      <Head>
        <title>next-karma | Next.js template</title>
      </Head>
      <TopLevelErrorBoundary showDialog>
        <Component {...pageProps} />
      </TopLevelErrorBoundary>
    </>
  );
}

/**
 * @see https://nextjs.org/docs/advanced-features/measuring-performance
 */
export const reportWebVitals = (metric: NextWebVitalsMetric): void => {
  // possible alternative implementation with an endpoint

  // const endpoint = '/analytics';
  // const body = JSON.stringify(metric);

  // if ('sendBeacon' in navigator) {
  //   navigator.sendBeacon(endpoint, body);
  // } else {
  //   fetch(endpoint, { keepalive: true, method: 'POST' });
  // }

  // this will _only_ send metrics for crashes
  configureScope((scope) => {
    const key = `web-vital-${metric.name.toLowerCase()}`;

    scope.setContext(key, metric);
  });
};
