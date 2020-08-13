import * as sentryNode from '@sentry/node';
import * as sentryReact from '@sentry/react';
import { render } from '@testing-library/react';
import { serialize } from 'cookie';
import { GetServerSidePropsContext } from 'next';

import {
  makeMockIncomingRequest,
  makeMockServerResponse,
} from '../../testUtils/api';
import { createMockScope } from '../../testUtils/sentry';
import { FALLBACK_LANGUAGE, SESSION_COOKIE_NAME } from '../constants';
import * as cookieUtils from '../server/auth/cookie';
import { i18nCache } from '../server/i18n/cache';
import * as detectLanguageUtils from '../server/i18n/detectLanguage';
import * as sentryUtils from '../utils/sentry/client';
import * as sentryUtilsServer from '../utils/sentry/server';
import {
  KarmaProvider,
  KarmaProps,
  getServerSideProps,
  withServerSideKarmaProps,
} from './Karma';
import { User } from './context/AuthContext/AuthContext';
import * as i18n from './i18n';

const defaultProps: KarmaProps = {
  cookies: '',
  i18nBundle: i18nCache.de,
  language: 'en',
  session: null,
};

describe('<KarmaProvider />', () => {
  test('initializes i18next', () => {
    const initI18NSpy = jest.spyOn(i18n, 'initI18Next');

    render(<KarmaProvider {...defaultProps}>next-karma</KarmaProvider>);

    expect(initI18NSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        i18nBundle: defaultProps.i18nBundle,
        language: defaultProps.language,
      })
    );
  });

  test('attaches component breadcrumb', () => {
    const attachComponentBreadcrumbSpy = jest.spyOn(
      sentryUtils,
      'attachComponentBreadcrumb'
    );

    const addBreadcrumbSpy = jest.spyOn(sentryReact, 'addBreadcrumb');

    render(<KarmaProvider {...defaultProps}>next-karma</KarmaProvider>);

    expect(attachComponentBreadcrumbSpy).toHaveBeenCalledWith('KarmaProvider');
    expect(addBreadcrumbSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        level: expect.any(String),
        message: expect.any(String),
      })
    );
  });
});

const mockCtx: GetServerSidePropsContext = {
  query: {},
  req: makeMockIncomingRequest(),
  res: makeMockServerResponse(),
};

const mockBundle = i18nCache[FALLBACK_LANGUAGE];

const setupSpies = () => {
  const getSessionSpy = jest
    .spyOn(cookieUtils, 'getSession')
    .mockImplementationOnce(() => null);
  const getI18NSpy = jest
    .spyOn(i18n, 'getI18N')
    .mockResolvedValueOnce(mockBundle);
  const detectLanguageSpy = jest
    .spyOn(detectLanguageUtils, 'detectLanguage')
    .mockImplementationOnce(() => FALLBACK_LANGUAGE);

  const attachInitialContextSpy = jest.spyOn(
    sentryUtils,
    'attachInitialContext'
  );

  const attachLambdaContextSpy = jest.spyOn(
    sentryUtilsServer,
    'attachLambdaContext'
  );

  const setContextSpy = jest.fn();
  const setExtraSpy = jest.fn();

  const configureScopeSpy = jest
    .spyOn(sentryReact, 'configureScope')
    .mockImplementationOnce((callback) =>
      callback(
        createMockScope({ setContext: setContextSpy, setExtra: setExtraSpy })
      )
    );

  return {
    attachInitialContextSpy,
    attachLambdaContextSpy,
    configureScopeSpy,
    detectLanguageSpy,
    getI18NSpy,
    getSessionSpy,
    setContextSpy,
    setExtraSpy,
  };
};

const setup = async (ctx = mockCtx) => {
  const spies = setupSpies();

  const result = await getServerSideProps(ctx);

  return {
    result,
    ...spies,
  };
};

describe('getServerSideProps', () => {
  test('attaches initial context', async () => {
    const mockSession: User = { id: '', name: '' };

    const headers = {
      cookie: serialize(SESSION_COOKIE_NAME, JSON.stringify(mockSession)),
    };

    const mockCtx: GetServerSidePropsContext = {
      query: {},
      req: makeMockIncomingRequest({ headers }),
      res: makeMockServerResponse(),
    };

    jest.spyOn(cookieUtils, 'getSession').mockImplementationOnce((_) => {
      return mockSession;
    });

    const {
      attachInitialContextSpy,
      setContextSpy,
      setExtraSpy,
      configureScopeSpy,
    } = await setup(mockCtx);

    expect(attachInitialContextSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        language: FALLBACK_LANGUAGE,
        req: mockCtx.req,
        session: mockSession,
      })
    );

    expect(configureScopeSpy).toHaveBeenCalledTimes(1);

    expect(setExtraSpy).toHaveBeenCalledWith('language', FALLBACK_LANGUAGE);

    expect(setContextSpy).toHaveBeenCalledWith('headers', headers);
    expect(setContextSpy).toHaveBeenCalledWith('session', mockSession);
  });

  test('attaches lambda context', async () => {
    const setContextSpy = jest.fn();
    const setTagSpy = jest.fn();

    const configureScopeSpy = jest
      .spyOn(sentryNode, 'configureScope')
      .mockImplementationOnce((callback) =>
        callback(
          createMockScope({ setContext: setContextSpy, setTag: setTagSpy })
        )
      );

    const { attachLambdaContextSpy } = await setup();

    expect(attachLambdaContextSpy).toHaveBeenCalledWith(mockCtx.req);

    expect(configureScopeSpy).toHaveBeenCalledTimes(1);

    expect(setContextSpy).toHaveBeenCalledWith('headers', expect.any(Object));

    expect(setTagSpy).toHaveBeenCalledWith('host', expect.any(String));
    expect(setTagSpy).toHaveBeenCalledWith('url', expect.any(String));
    expect(setTagSpy).toHaveBeenCalledWith('method', expect.any(String));
  });

  test('loads session', async () => {
    const { getSessionSpy } = await setup();

    expect(getSessionSpy).toHaveBeenCalledWith(mockCtx.req);
  });

  test('detects language', async () => {
    const { detectLanguageSpy } = await setup();

    expect(detectLanguageSpy).toHaveBeenCalledWith(mockCtx.req);
  });

  test('loads i18n bundle', async () => {
    const { getI18NSpy } = await setup();

    expect(getI18NSpy).toHaveBeenCalledWith(FALLBACK_LANGUAGE, mockCtx.req);
  });

  test('matches expected shape', async () => {
    const { result } = await setup();

    expect(result).toMatchObject({
      props: {
        karma: expect.objectContaining({
          cookies: '',
          i18nBundle: mockBundle,
          language: FALLBACK_LANGUAGE,
          session: null,
        }),
      },
    });
  });
});

describe('withServerSideKarmaProps', () => {
  const mockProps = { foo: 1 };

  test('returns a function', () => {
    const getServerSideProps = withServerSideKarmaProps(jest.fn());

    expect(getServerSideProps).toBeInstanceOf(Function);
  });

  test('executes given handler, forwarding context', async () => {
    setupSpies();

    const mockHandler = jest.fn().mockResolvedValueOnce({ props: mockProps });
    const getServerSideProps = withServerSideKarmaProps(mockHandler);

    await getServerSideProps(mockCtx);

    expect(mockHandler).toHaveBeenCalledWith(mockCtx);
  });

  test('bubbles errors', async () => {
    setupSpies();

    const mockHandler = jest.fn().mockImplementationOnce(() => {
      throw new Error('error');
    });
    const getServerSideProps = withServerSideKarmaProps(mockHandler);

    const errorHandler = jest.fn();

    try {
      await getServerSideProps(mockCtx);
    } catch (error) {
      errorHandler(error);
    }

    expect(errorHandler).toHaveBeenCalledTimes(1);
  });

  test('merges karma getServerSideProps with handlers result', async () => {
    setupSpies();

    const mockHandler = jest.fn().mockResolvedValueOnce({ props: mockProps });
    const getServerSideProps = withServerSideKarmaProps(mockHandler);
    const result = await getServerSideProps(mockCtx);

    expect(result).toMatchObject({
      props: expect.objectContaining({
        karma: {
          cookies: '',
          i18nBundle: mockBundle,
          language: FALLBACK_LANGUAGE,
          session: null,
        },
        ...mockProps,
      }),
    });
  });
});
