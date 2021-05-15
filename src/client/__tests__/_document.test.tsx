import NextDocument from 'next/document';
import { renderToStaticMarkup } from 'react-dom/server';
import { isValidElement } from 'react';

import { i18nCache } from '../../../testUtils/i18n';
import { FALLBACK_LANGUAGE } from '../../constants';
import Document from '../../pages/_document';

import type { KarmaSSRProps } from '../karma/SSR';
import type { DocumentProps } from 'next/document';

const pageProps: KarmaSSRProps = {
  auth: { session: null },
  cookies: '',
  i18n: {
    locale: FALLBACK_LANGUAGE,
    resources: i18nCache,
  },
};

const defaultProps: DocumentProps = {
  __NEXT_DATA__: {
    appGip: true,
    buildId: Math.floor(Math.random() * 1000).toString(),
    page: '/',
    props: { pageProps },
    query: {},
  },
  ampPath: '/',
  buildManifest: {
    ampDevFiles: [],
    ampFirstPages: [],
    devFiles: [],
    lowPriorityFiles: [],
    pages: {
      '/': [],
      '/_app': [],
    },
    polyfillFiles: [],
  },
  canonicalBase: '/',
  dangerousAsPath: '/',
  devOnlyCacheBusterQueryString: '',
  docComponentsRendered: {
    Head: false,
    Html: false,
    Main: false,
    NextScript: false,
  },
  dynamicImports: [],
  headTags: [],
  html: '',
  hybridAmp: false,
  inAmpMode: false,
  isDevelopment: false,
  scriptLoader: {},
};

describe('<Document />', () => {
  it('renders without crashing given default props', () => {
    // @ts-expect-error next types are not entirely compatible with a Document
    const html = Document.renderDocument(Document, defaultProps);

    expect(isValidElement(html)).toBeTruthy();
  });

  it('uses getInitialProps of NextDocument', () => {
    // eslint-disable-next-line jest/unbound-method
    expect(Document.getInitialProps).toBe(NextDocument.getInitialProps);
  });

  it('uses renderDocument of NextDocument', () => {
    // eslint-disable-next-line jest/unbound-method
    expect(Document.renderDocument).toBe(NextDocument.renderDocument);
  });

  /**
   * not the best tests below, but I didn't want to add dom-parser or cheerio
   */
  it('sets "dir" attribute on html tag', () => {
    const text = renderToStaticMarkup(
      // @ts-expect-error next types are not entirely compatible with a Document
      // function component
      Document.renderDocument(Document, defaultProps)
    );

    expect(text.includes('dir="auto"')).toBeTruthy();
  });

  it('links manifest.json', () => {
    const text = renderToStaticMarkup(
      // @ts-expect-error next types are not entirely compatible with a Document
      // function component
      Document.renderDocument(Document, defaultProps)
    );

    expect(text.includes('rel="manifest"')).toBeTruthy();
  });
});
