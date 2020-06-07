import NextDocument, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentProps,
} from 'next/document';
import React from 'react';

export default function Document({ __NEXT_DATA__: { props } }: DocumentProps) {
  const { lang } = props.pageProps;

  return (
    <Html lang={lang}>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

Document.renderDocument = NextDocument.renderDocument;

Document.getInitialProps = async (ctx: DocumentContext) => {
  return await NextDocument.getInitialProps(ctx);
};
