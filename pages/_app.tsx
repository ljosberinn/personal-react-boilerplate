import { AppProps } from 'next/app';
import React from 'react';

import Layout from '../src/client/Layout';
import { ErrorBoundary } from '../src/client/components/ErrorBoundary';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ErrorBoundary>
  );
}
