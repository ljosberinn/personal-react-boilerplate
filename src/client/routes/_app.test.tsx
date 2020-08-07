/* eslint-disable jest/require-top-level-describe */
import { render } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { AppContext, AppInitialProps } from 'next/app';
import { Router } from 'next/router';
import React from 'react';
import 'whatwg-fetch';

import App, { AppRenderProps, getInitialProps } from '../../../pages/_app';
import { makeMockIncomingRequest } from '../../../testUtils/api';
import { SUPPORTED_LANGUAGES_MAP } from '../../constants';
import * as cookieUtils from '../../server/auth/cookie';
import { i18nCache } from '../../server/i18n/cache';
import * as i18nServer from '../../server/i18n/detectLanguage';
import * as sentryUtils from '../../utils/sentry/client';
import * as i18nClient from '../i18n';

const server = setupServer(
  // TODO: hardcoded because not importable from i18n at this point
  rest.get('http://localhost:3000/api/v1/i18n/en', (_req, res, ctx) =>
    res(ctx.json(i18nCache.en))
  )
);

beforeAll(() => {
  server.listen();
});

afterEach(() => server.resetHandlers());

afterAll(() => {
  server.close();
});

const defaultProps: AppRenderProps = {
  Component: () => null,
  pageProps: {
    cookies: '',
    i18nBundle: { namespace: {} },
    language: 'en',
    session: null,
  },
  router: new Router('/', {}, '', {
    App: () => null,
    Component: () => null,
    initialProps: {},
    isFallback: false,
    pageLoader: undefined,
    subscription: async () => {},
    wrapApp: () => {},
  }),
};

describe('<App />', () => {
  it('renders without crashing given default props', () => {
    render(<App {...defaultProps} />);
  });

  it('initializes i18n', () => {
    const initI18NextSpy = jest.spyOn(i18nClient, 'initI18Next');

    render(<App {...defaultProps} />);

    expect(initI18NextSpy).toHaveBeenCalledWith(defaultProps.pageProps);
  });

  it('attaches routing breadcrumbs to Sentry', () => {
    const attachRoutingContextSpy = jest.spyOn(
      sentryUtils,
      'attachRoutingContext'
    );

    render(<App {...defaultProps} />);

    expect(attachRoutingContextSpy).toHaveBeenCalledWith(
      expect.any(Router),
      expect.any(String)
    );
  });
});

const appContext: AppContext = {
  AppTree: () => null,
  Component: () => null,
  ctx: {
    AppTree: (_: AppInitialProps) => <h1>test</h1>,
    pathname: '/',
    query: {},
    req: makeMockIncomingRequest(),
  },
  router: new Router('/', {}, '', {
    App: () => null,
    Component: () => null,
    initialProps: {},
    isFallback: false,
    pageLoader: undefined,
    subscription: async () => {},
    wrapApp: () => {},
  }),
};

describe('App.getInitialProps()', () => {
  it('loads session on boot', async () => {
    const getSessionSpy = jest.spyOn(cookieUtils, 'getSession');

    const { pageProps } = await getInitialProps(appContext);

    expect(getSessionSpy).toHaveBeenCalledWith(appContext.ctx.req);

    expect(pageProps).toMatchObject({
      cookies: '',
      // in theory, we could check for i18nCache.en here but it's actually
      // machine dependant, so in my case .de
      i18nBundle: expect.any(Object),
      language: defaultProps.pageProps.language,
      session: null,
    });
  });

  it('detects language on boot', async () => {
    const detectLanguageSpy = jest.spyOn(i18nServer, 'detectLanguage');

    const initialProps = await getInitialProps(appContext);

    expect(detectLanguageSpy).toBeCalledWith(appContext.ctx);

    expect(initialProps.pageProps).toMatchObject({
      cookies: '',
      // in theory, we could check for i18nCache.en here but it's actually
      // machine dependant, so in my case .de
      i18nBundle: expect.any(Object),
      language: defaultProps.pageProps.language,
      session: null,
    });
  });

  it('loads i18n on boot', async () => {
    const getI18NSpy = jest.spyOn(i18nClient, 'getI18N');

    const { pageProps } = await getInitialProps(appContext);

    expect(getI18NSpy).toHaveBeenCalledWith(
      SUPPORTED_LANGUAGES_MAP.en,
      appContext.ctx
    );

    expect(pageProps).toMatchObject({
      cookies: '',
      // in theory, we could check for i18nCache.en here but it's actually
      // machine dependant, so in my case .de
      i18nBundle: expect.any(Object),
      language: defaultProps.pageProps.language,
      session: null,
    });
  });

  it('attaches initial context to Sentry on boot', async () => {
    const attachInitialContextSpy = jest.spyOn(
      sentryUtils,
      'attachInitialContext'
    );

    const { pageProps } = await getInitialProps(appContext);

    expect(attachInitialContextSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        language: SUPPORTED_LANGUAGES_MAP.en,
        req: appContext.ctx.req,
        session: null,
      })
    );

    expect(pageProps).toMatchObject({
      cookies: '',
      // in theory, we could check for i18nCache.en here but it's actually
      // machine dependant, so in my case .de
      i18nBundle: expect.any(Object),
      language: defaultProps.pageProps.language,
      session: null,
    });
  });
});
