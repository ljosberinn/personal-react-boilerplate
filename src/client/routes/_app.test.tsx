import theme from '@chakra-ui/theme';
import { render } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { AppContext, AppInitialProps } from 'next/app';
import { Router } from 'next/router';
import fetch from 'node-fetch';
import React from 'react';

import App, { AppRenderProps, getInitialProps } from '../../../pages/_app';
import { makeMockIncomingRequest } from '../../../testUtils/api';
import { SUPPORTED_LANGUAGES_MAP } from '../../constants';
import * as cookieUtils from '../../server/auth/cookie';
import { i18nCache } from '../../server/i18n';
import * as sentryUtils from '../../utils/sentry';
import * as useThemePersistenceUtils from '../hooks/useThemePersistence';
import * as i18n from '../i18n';

const server = setupServer(
  rest.get('http://localhost:3000/api/v1/i18n/en', (_req, res, ctx) =>
    res(ctx.json(i18nCache.en))
  )
);

beforeAll(() => {
  // @ts-expect-error
  global.fetch = fetch;
  server.listen();
});

afterEach(() => server.resetHandlers());

afterAll(() => {
  // @ts-expect-error
  global.fetch = undefined;
  server.close();
});

const defaultProps: AppRenderProps = {
  Component: () => null,
  pageProps: {
    i18nBundle: { namespace: {} },
    // @ts-expect-error
    initialColorMode: theme.config.initialColorMode,
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
    const initI18NextSpy = jest.spyOn(i18n, 'initI18Next');

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
      // in theory, we could check for i18nCache.en here but it's actually
      // machine dependant, so in my case .de
      i18nBundle: expect.any(Object),
      initialColorMode: theme.config.initialColorMode,
      language: defaultProps.pageProps.language,
      session: null,
    });
  });

  it('detects language on boot', async () => {
    const detectLanguageSpy = jest.spyOn(i18n, 'detectLanguage');

    const initialProps = await getInitialProps(appContext);

    expect(detectLanguageSpy).toBeCalledWith(appContext.ctx);

    expect(initialProps.pageProps).toMatchObject({
      // in theory, we could check for i18nCache.en here but it's actually
      // machine dependant, so in my case .de
      i18nBundle: expect.any(Object),
      initialColorMode: theme.config.initialColorMode,
      language: defaultProps.pageProps.language,
      session: null,
    });
  });

  it('detects initialColorMode on boot', async () => {
    const detectInitialColorModeSpy = jest.spyOn(
      useThemePersistenceUtils,
      'detectInitialColorMode'
    );

    const { pageProps } = await getInitialProps(appContext);

    expect(detectInitialColorModeSpy).toHaveBeenCalledWith(appContext.ctx);

    expect(pageProps).toMatchObject({
      // in theory, we could check for i18nCache.en here but it's actually
      // machine dependant, so in my case .de
      i18nBundle: expect.any(Object),
      initialColorMode: theme.config.initialColorMode,
      language: defaultProps.pageProps.language,
      session: null,
    });
  });

  it('loads i18n on boot', async () => {
    const getI18NSpy = jest.spyOn(i18n, 'getI18N');

    const { pageProps } = await getInitialProps(appContext);

    expect(getI18NSpy).toHaveBeenCalledWith(
      SUPPORTED_LANGUAGES_MAP.en,
      appContext.ctx
    );

    expect(pageProps).toMatchObject({
      // in theory, we could check for i18nCache.en here but it's actually
      // machine dependant, so in my case .de
      i18nBundle: expect.any(Object),
      initialColorMode: theme.config.initialColorMode,
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
        initialColorMode: theme.config.initialColorMode,
        language: SUPPORTED_LANGUAGES_MAP.en,
        req: appContext.ctx.req,
        session: null,
      })
    );

    expect(pageProps).toMatchObject({
      // in theory, we could check for i18nCache.en here but it's actually
      // machine dependant, so in my case .de
      i18nBundle: expect.any(Object),
      initialColorMode: theme.config.initialColorMode,
      language: defaultProps.pageProps.language,
      session: null,
    });
  });
});
