import { NextComponentType, NextPageContext } from 'next';
import { DefaultSeo } from 'next-seo';
import { NextRouter } from 'next/router';
import React from 'react';

import { seo } from '../next-seo.config';
import {
  attachRoutingContext,
  ErrorBoundary as TopLevelErrorBoundary,
} from '../src/utils/sentry/client';

export interface AppRenderProps {
  pageProps: object;
  err?: Error;
  Component?: NextComponentType<NextPageContext, AppRenderProps, object>;
  router?: NextRouter;
}

// eslint-disable-next-line import/no-default-export
export default function App({ Component, pageProps, router }: AppRenderProps) {
  if (!Component) {
    return null;
  }

  if (router) {
    attachRoutingContext(router, Component.name);
  }

  return (
    <>
      <DefaultSeo {...seo} />
      <TopLevelErrorBoundary showDialog>
        <Component {...pageProps} />
      </TopLevelErrorBoundary>
    </>
  );
}
