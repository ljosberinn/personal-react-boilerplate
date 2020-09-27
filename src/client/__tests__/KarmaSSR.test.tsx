import * as sentryNode from '@sentry/node';
import * as sentryReact from '@sentry/react';
import { serialize } from 'cookie';
import type { GetServerSidePropsContext } from 'next';

import type { User } from '../../../src/client/context/AuthContext/AuthContext';
import type { Namespace } from '../../../src/constants';
import { FALLBACK_LANGUAGE, SESSION_COOKIE_NAME } from '../../../src/constants';
import { render } from '../../../testUtils';
import {
  createIncomingRequestMock,
  createServerResponseMock,
} from '../../../testUtils/api';
import { createMockScope } from '../../../testUtils/sentry';
import * as cookieUtils from '../../server/auth/cookie';
import { i18nCache } from '../../server/i18n/cache';
import * as detectLanguageUtils from '../../server/i18n/detectLanguage';
import * as sentryUtils from '../../utils/sentry/client';
import * as sentryUtilsServer from '../../utils/sentry/server';
import type { KarmaSSRProps } from '../Karma';
import {
  KarmaSSR,
  getServerSideProps,
  withKarmaSSRProps,
  createGetServerSideProps,
} from '../Karma';
import * as i18n from '../i18n';
import type { I18nextResourceLocale } from '../i18n';

describe('<KarmaSSR />', () => {
  const defaultProps: KarmaSSRProps = {
    auth: {
      session: null,
    },
    cookies: '',
    i18n: {
      bundle: i18nCache.de,
      language: 'en',
    },
  };

  test('initializes i18next', () => {
    const initI18NSpy = jest.spyOn(i18n, 'initI18Next');

    render(<KarmaSSR {...defaultProps}>next-karma</KarmaSSR>, {
      omitKarmaProvider: true,
    });

    expect(initI18NSpy).toHaveBeenCalledWith(
      expect.objectContaining(defaultProps.i18n)
    );
  });

  test('attaches component breadcrumb', () => {
    const attachComponentBreadcrumbSpy = jest.spyOn(
      sentryUtils,
      'attachComponentBreadcrumb'
    );

    const addBreadcrumbSpy = jest.spyOn(sentryReact, 'addBreadcrumb');

    render(<KarmaSSR {...defaultProps}>next-karma</KarmaSSR>, {
      omitKarmaProvider: true,
    });

    expect(attachComponentBreadcrumbSpy).toHaveBeenCalledWith('KarmaSSR');
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
  req: createIncomingRequestMock(),
  res: createServerResponseMock(),
  resolvedUrl: '',
};

const mockBundle = i18nCache[FALLBACK_LANGUAGE];

const setupSpies = () => {
  const getSessionSpy = jest
    .spyOn(cookieUtils, 'getSession')
    .mockReturnValueOnce(null);

  const getI18nSpy = jest
    .spyOn(i18n, 'getI18n')
    .mockImplementationOnce((_, { namespaces } = {}) =>
      Promise.resolve(
        (() => {
          if (Array.isArray(namespaces) && namespaces.length > 0) {
            return namespaces.reduce<Partial<I18nextResourceLocale>>(
              (carry, namespace) => {
                carry[namespace] = mockBundle[namespace];

                return carry;
              },
              {}
            );
          }

          return mockBundle;
        })()
      )
    );

  const detectLanguageSpy = jest
    .spyOn(detectLanguageUtils, 'detectLanguage')
    .mockReturnValueOnce(FALLBACK_LANGUAGE);

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
    // eslint-disable-next-line promise/prefer-await-to-callbacks
    .mockImplementationOnce((callback) =>
      // eslint-disable-next-line promise/prefer-await-to-callbacks
      callback(
        createMockScope({ setContext: setContextSpy, setExtra: setExtraSpy })
      )
    );

  return {
    attachInitialContextSpy,
    attachLambdaContextSpy,
    configureScopeSpy,
    detectLanguageSpy,
    getI18nSpy,
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
      req: createIncomingRequestMock({ headers }),
      res: createServerResponseMock(),
      resolvedUrl: '',
    };

    jest.spyOn(cookieUtils, 'getSession').mockReturnValueOnce(mockSession);

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
      // eslint-disable-next-line promise/prefer-await-to-callbacks
      .mockImplementationOnce((callback) =>
        // eslint-disable-next-line promise/prefer-await-to-callbacks
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
    const { getI18nSpy } = await setup();

    expect(getI18nSpy).toHaveBeenCalledWith(
      FALLBACK_LANGUAGE,
      expect.objectContaining({
        req: mockCtx.req,
      })
    );
  });

  test('matches expected shape', async () => {
    const { result } = await setup();

    expect(result).toMatchObject({
      props: {
        karma: expect.objectContaining({
          auth: {
            session: null,
            shouldAttemptReauthentication: false,
          },
          cookies: '',
          i18n: {
            bundle: mockBundle,
            language: FALLBACK_LANGUAGE,
          },
        }),
      },
    });
  });
});

describe('createGetServerSideProps', () => {
  const namespaces: Namespace[] = ['serviceWorker'];

  test('returns a function', () => {
    expect(
      createGetServerSideProps({
        i18n: {
          namespaces: [],
        },
      })
    ).toBeInstanceOf(Function);
  });

  test('forwards i18nNamespaces onto getI18n', async () => {
    const { getI18nSpy } = setupSpies();

    await createGetServerSideProps({
      i18n: {
        namespaces: [],
      },
    })(mockCtx);

    expect(getI18nSpy).toHaveBeenCalledWith(
      FALLBACK_LANGUAGE,
      expect.objectContaining({
        namespaces: [],
        req: mockCtx.req,
      })
    );
  });

  test('given empty i18nNamespaces, loads all namespaces', async () => {
    setupSpies();

    const result = await createGetServerSideProps({
      i18n: {
        namespaces: [],
      },
    })(mockCtx);

    expect(result.props.karma.i18n.bundle).toMatchObject(
      i18nCache[FALLBACK_LANGUAGE]
    );
  });

  test('given a single i18nNamespace, loads only that one', async () => {
    setupSpies();

    const result = await createGetServerSideProps({ i18n: { namespaces } })(
      mockCtx
    );

    expect(result.props.karma.i18n.bundle).toMatchObject(
      expect.objectContaining({
        [namespaces[0]]: expect.any(Object),
      })
    );
  });
});

describe('withServerSideKarmaProps', () => {
  const mockProps = { foo: 1 };

  test('returns a function', () => {
    const getServerSideProps = withKarmaSSRProps(jest.fn());

    expect(getServerSideProps).toBeInstanceOf(Function);
  });

  test('executes given handler, forwarding context', async () => {
    setupSpies();

    const mockHandler = jest.fn().mockResolvedValueOnce({ props: mockProps });
    const getServerSideProps = withKarmaSSRProps(mockHandler);

    await getServerSideProps(mockCtx);

    expect(mockHandler).toHaveBeenCalledWith(mockCtx);
  });

  test('bubbles errors', async () => {
    setupSpies();

    const mockHandler = jest.fn().mockImplementationOnce(() => {
      throw new Error('error');
    });
    const getServerSideProps = withKarmaSSRProps(mockHandler);

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
    const getServerSideProps = withKarmaSSRProps(mockHandler);
    const result = await getServerSideProps(mockCtx);

    expect(result).toMatchObject({
      props: expect.objectContaining({
        karma: {
          auth: {
            session: null,
            shouldAttemptReauthentication: false,
          },
          cookies: '',
          i18n: {
            bundle: mockBundle,
            language: FALLBACK_LANGUAGE,
          },
        },
        ...mockProps,
      }),
    });
  });
});
