import type { NextWebVitalsMetric } from 'next/app';
import type { NextRouter } from 'next/router';

import type {
  NextComponentWithKarma,
  KarmaSSGProps,
  KarmaSSRProps,
} from '../src/client/Karma';
import { getKarmaProvider, layoutPassthrough } from '../src/client/Karma';
import {
  attachRoutingContext,
  ErrorBoundary as TopLevelErrorBoundary,
  configureScope,
} from '../src/utils/sentry/client';

export type AppRenderProps = {
  pageProps: object & { karma?: KarmaSSGProps | KarmaSSRProps };
  err?: Error;
  Component: NextComponentWithKarma;
  router: NextRouter;
};

// eslint-disable-next-line import/no-default-export
export default function App({
  Component,
  pageProps,
  router,
}: AppRenderProps): JSX.Element | null {
  attachRoutingContext(router, Component);

  const { withLayout = layoutPassthrough } = Component;
  const { karma, ...rest } = pageProps;

  const IsomorphicKarma = getKarmaProvider(karma);

  return (
    <TopLevelErrorBoundary showDialog>
      <IsomorphicKarma {...karma}>
        {withLayout(<Component {...rest} />)}
      </IsomorphicKarma>
    </TopLevelErrorBoundary>
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
