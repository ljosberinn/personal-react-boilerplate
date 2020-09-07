import type { DocumentProps } from 'next/document';
import NextDocument from 'next/document';
import { isValidElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import Document from '../../../pages/_document';
import { i18nCache } from '../../server/i18n/cache';
import * as sentryUtils from '../../utils/sentry/client';
import type { KarmaProps } from '../Karma';

const pageProps: Omit<KarmaProps, 'children'> = {
  i18nBundle: i18nCache.en,
  language: 'en',
  session: null,
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
};

describe('<Document />', () => {
  it('renders without crashing given default props', () => {
    // @ts-expect-error next types are not entirely compatible with a Document
    const html = Document.renderDocument(Document, defaultProps);

    expect(isValidElement(html)).toBeTruthy();
  });

  it('uses getInitialProps of NextDocument', () => {
    expect(Document.getInitialProps).toBe(NextDocument.getInitialProps);
  });

  it('uses renderDocument of NextDocument', () => {
    expect(Document.renderDocument).toBe(NextDocument.renderDocument);
  });

  it('attaches a breadcrumb to Sentry', () => {
    const attachComponentBreadcrumbSpy = jest.spyOn(
      sentryUtils,
      'attachComponentBreadcrumb'
    );

    renderToStaticMarkup(
      // @ts-expect-error next types are not entirely compatible with a Document
      // function component
      Document.renderDocument(Document, defaultProps)
    );

    expect(attachComponentBreadcrumbSpy).toHaveBeenCalledWith('document');
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
