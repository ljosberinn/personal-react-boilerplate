import { InitializeColorMode } from '@chakra-ui/core';
import * as Sentry from '@sentry/node';
import NextDocument, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentProps,
} from 'next/document';
import React from 'react';

import { attachComponentBreadcrumb } from '../src/utils/sentry';
import { PageProps } from './_app';

/**
 * Send to Sentry all uncaught exceptions.
 *
 * If such error happens in this file, it will completely crash the server and
 * render "Internal Server Error" on the client.
 * @see https://leerob.io/blog/configuring-sentry-for-nextjs-apps
 */
['unhandledRejection', 'uncaughtException'].forEach(event => {
  process.on(event, e => {
    Sentry.captureException(e);
  });
});

// eslint-disable-next-line import/no-default-export
export default function CustomDocument({
  __NEXT_DATA__: { props },
}: DocumentProps) {
  const { language } = props.pageProps as PageProps;

  attachComponentBreadcrumb('document');

  return (
    <Html lang={language} dir="auto">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#d41143" />
        <meta name="msapplication-TileColor" content="#ffffff" />
      </Head>
      <body>
        <InitializeColorMode />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

CustomDocument.renderDocument = NextDocument.renderDocument;
CustomDocument.getInitialProps = NextDocument.getInitialProps;
