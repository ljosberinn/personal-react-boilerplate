import { ColorModeScript } from '@chakra-ui/core';
import { captureException } from '@sentry/node';
import NextDocument, { Html, Head, Main, NextScript } from 'next/document';

import { attachComponentBreadcrumb } from '../karma/utils/sentry/client';

/**
 * Send to Sentry all uncaught exceptions.
 *
 * Safe to include - will not lead to the frontend bundle importing a polyfill
 * for node.process!
 *
 * If such error happens in this file, it will completely crash the server and
 * render "Internal Server Error" on the client.
 * @see https://leerob.io/blog/configuring-sentry-for-nextjs-apps
 */
['unhandledRejection', 'uncaughtException'].forEach((event) => {
  process.on(event, captureException);
});

const title = 'next-karma | Next.js template';
const description =
  'next-karma - an opinonated batteries-included Next.js template | Authentication, Internationalization, Error Handling';

// eslint-disable-next-line import/no-default-export
export default function CustomDocument(): JSX.Element {
  attachComponentBreadcrumb('document');

  return (
    <Html dir="auto">
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
        <meta name="msapplication-TileColor" content="#1A202C" />
        <meta name="description" content={description} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@gerrit_alex" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta
          property="og:image"
          content="https://personal-react-boilerplate.now.sh/next-karma-h600.png"
        />
        <meta property="og:image:alt" content={title} />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:width" content="600" />
        <meta content="global" name="distribution" />
        <meta content="7 days" name="revisit-after" />
        <meta content="Gerrit Alex" name="author" />
      </Head>
      <body>
        <ColorModeScript />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

// eslint-disable-next-line @typescript-eslint/unbound-method
CustomDocument.renderDocument = NextDocument.renderDocument;
// eslint-disable-next-line @typescript-eslint/unbound-method
CustomDocument.getInitialProps = NextDocument.getInitialProps;
