import { InitializeColorMode } from '@chakra-ui/core';
import * as Sentry from '@sentry/node';
import NextDocument, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
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

type CustomDocumentProps = DocumentProps & any;

export default function CustomDocument({
  __NEXT_DATA__: { props },
}: CustomDocumentProps) {
  const { language } = props.pageProps as PageProps;

  attachComponentBreadcrumb('document');

  return (
    <Html lang={language} dir="auto">
      <Head>
        <link rel="manifest" href="/manifest.json" />
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

CustomDocument.getInitialProps = (ctx: DocumentContext) =>
  NextDocument.getInitialProps(ctx);
