import * as sentryNode from '@sentry/node';
import * as sentryReact from '@sentry/react';
import { serialize } from 'cookie';
import type { GetServerSidePropsContext } from 'next';

import { FALLBACK_LANGUAGE, SESSION_COOKIE_NAME } from '../../../src/constants';
import type { Namespace } from '../../../src/constants';
import {
  createNextApiRequestMock,
  createServerResponseMock,
} from '../../../testUtils/api';
import { i18nCache } from '../../../testUtils/i18n';
import { createMockScope } from '../../../testUtils/sentry';
import * as cookieUtils from '../../server/auth/cookie';
import * as sentryUtils from '../../utils/sentry/client';
import * as sentryUtilsServer from '../../utils/sentry/server';
import { TEMPORARY_REDIRECT } from '../../utils/statusCodes';
import type { User } from '../context/AuthContext/types';
import {
  getServerSideProps,
  withKarmaSSRProps,
  createGetServerSideProps,
} from '../karma/getServerSideProps';
import * as i18n from '../karma/i18n';

const mockCtx: GetServerSidePropsContext = {
  query: {},
  req: createNextApiRequestMock(),
  res: createServerResponseMock({
    end: jest.fn(),
    writeHead: jest.fn(),
  }),
  resolvedUrl: '',
};

const setupSpies = () => {
  const getSessionSpy = jest
    .spyOn(cookieUtils, 'getSession')
    .mockReturnValueOnce(null);

  const getI18nSpy = jest
    .spyOn(i18n, 'getI18n')
    .mockImplementationOnce((language, { namespaces } = {}) => {
      if (Array.isArray(namespaces) && namespaces.length > 0) {
        return Promise.resolve({
          [language]: Object.fromEntries(
            namespaces.map((namespace) => [
              namespace,
              i18nCache[language][namespace],
            ])
          ),
        });
      }

      return Promise.resolve({ [language]: i18nCache[language] });
    });

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
    .mockImplementationOnce((callback) => {
      // eslint-disable-next-line promise/prefer-await-to-callbacks
      callback(
        createMockScope({ setContext: setContextSpy, setExtra: setExtraSpy })
      );
    });

  return {
    attachInitialContextSpy,
    attachLambdaContextSpy,
    configureScopeSpy,
    getI18nSpy,
    getSessionSpy,
    setContextSpy,
    setExtraSpy,
  };
};

const setup = async (
  ctx = mockCtx,
  options?: Parameters<typeof getServerSideProps>[1]
) => {
  const spies = setupSpies();

  const result = await getServerSideProps(ctx ?? mockCtx, options);

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
      req: createNextApiRequestMock({ headers }),
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
        locale: FALLBACK_LANGUAGE,
        req: mockCtx.req,
        session: mockSession,
      })
    );

    expect(configureScopeSpy).toHaveBeenCalledTimes(1);

    expect(setExtraSpy).toHaveBeenCalledWith('locale', FALLBACK_LANGUAGE);

    expect(setContextSpy).toHaveBeenCalledWith('headers', headers);
    expect(setContextSpy).toHaveBeenCalledWith('session', mockSession);
  });

  test('attaches lambda context', async () => {
    const setContextSpy = jest.fn();
    const setTagSpy = jest.fn();

    const configureScopeSpy = jest
      .spyOn(sentryNode, 'configureScope')
      // eslint-disable-next-line promise/prefer-await-to-callbacks
      .mockImplementationOnce((callback) => {
        // eslint-disable-next-line promise/prefer-await-to-callbacks
        callback(
          createMockScope({ setContext: setContextSpy, setTag: setTagSpy })
        );
      });

    const { attachLambdaContextSpy } = await setup();

    expect(attachLambdaContextSpy).toHaveBeenCalledWith(mockCtx.req);

    expect(configureScopeSpy).toHaveBeenCalledTimes(1);

    expect(setContextSpy).toHaveBeenCalledWith('headers', expect.any(Object));

    expect(setTagSpy).toHaveBeenCalledWith('host', expect.any(String));
    expect(setTagSpy).toHaveBeenCalledWith('url', expect.any(String));
    expect(setTagSpy).toHaveBeenCalledWith('method', expect.any(String));
  });

  describe('auth', () => {
    test('loads session', async () => {
      const { getSessionSpy } = await setup();

      expect(getSessionSpy).toHaveBeenCalledWith(mockCtx.req);
    });

    describe('given no session and options.auth.redirectDestinationIfUnauthenticated', () => {
      test('redirects serverside', async () => {
        const url = '/foo';

        const { result } = await setup(mockCtx, {
          auth: { redirectDestinationIfUnauthenticated: url },
          i18n: {},
        });

        expect(mockCtx.res.writeHead).toHaveBeenCalledTimes(1);
        expect(mockCtx.res.writeHead).toHaveBeenCalledWith(
          TEMPORARY_REDIRECT,
          expect.objectContaining({
            Location: url,
          })
        );

        expect(mockCtx.res.end).toHaveBeenCalledTimes(1);

        expect(result).toStrictEqual({
          props: {
            karma: {
              auth: {
                redirectDestinationIfUnauthenticated: url,
                session: null,
              },
              i18n: {
                locale: FALLBACK_LANGUAGE,
                resources: {},
              },
            },
          },
        });
      });

      test('forwards url for client side redirect given a referrer', async () => {
        const url = '/foo';

        const req = createNextApiRequestMock({
          headers: {
            referer: '/',
          },
        });

        const { result } = await setup(
          { ...mockCtx, req },
          {
            auth: { redirectDestinationIfUnauthenticated: url },
            i18n: {},
          }
        );

        expect(mockCtx.res.writeHead).not.toHaveBeenCalledTimes(1);
        expect(mockCtx.res.end).not.toHaveBeenCalledTimes(1);

        expect(result).toStrictEqual({
          props: {
            karma: {
              auth: {
                redirectDestinationIfUnauthenticated: url,
                session: null,
              },
              i18n: {
                locale: FALLBACK_LANGUAGE,
                resources: {},
              },
            },
          },
        });
      });
    });
  });

  describe('i18n', () => {
    test('loads i18n resources', async () => {
      const { getI18nSpy } = await setup();

      expect(getI18nSpy).toHaveBeenCalledWith(FALLBACK_LANGUAGE, {
        namespaces: undefined,
      });
    });
  });

  test('matches expected shape', async () => {
    const { result } = await setup();

    expect(result).toStrictEqual({
      props: {
        karma: {
          auth: {
            session: null,
          },
          cookies: '',
          i18n: {
            locale: FALLBACK_LANGUAGE,
            resources: {
              [FALLBACK_LANGUAGE]: i18nCache[FALLBACK_LANGUAGE],
            },
          },
        },
      },
    });
  });
});

describe('createGetServerSideProps', () => {
  const namespaces: Namespace[] = ['serviceWorker'];

  describe('i18n', () => {
    test('forwards namespaces onto getI18n', async () => {
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
        })
      );
    });

    test('given empty namespaces, loads all namespaces', async () => {
      setupSpies();

      const result = await createGetServerSideProps({
        i18n: {
          namespaces: [],
        },
      })(mockCtx);

      expect(result.props.karma.i18n.resources).toMatchObject({
        [FALLBACK_LANGUAGE]: i18nCache[FALLBACK_LANGUAGE],
      });
    });

    test('given a single namespace, loads only that one', async () => {
      setupSpies();

      const result = await createGetServerSideProps({ i18n: { namespaces } })(
        mockCtx
      );

      expect(result.props.karma.i18n.resources).toStrictEqual({
        [FALLBACK_LANGUAGE]: {
          [namespaces[0]]: expect.any(Object),
        },
      });
    });
  });
});

describe('withServerSideKarmaProps', () => {
  const mockProps = { foo: 1 };

  test('executes given handler, forwarding context', async () => {
    setupSpies();

    const mockHandler = jest.fn().mockResolvedValueOnce({ props: mockProps });
    const getServerSideProps = withKarmaSSRProps(mockHandler);

    await getServerSideProps(mockCtx);

    expect(mockHandler).toHaveBeenCalledWith(mockCtx);
  });

  test('bubbles errors', async () => {
    setupSpies();

    const mockError = new Error('error');
    const mockHandler = jest.fn().mockImplementationOnce(() => {
      throw mockError;
    });
    const getServerSideProps = withKarmaSSRProps(mockHandler);

    const errorHandler = jest.fn();

    try {
      await getServerSideProps(mockCtx);
    } catch (error) {
      errorHandler(error);
    }

    expect(errorHandler).toHaveBeenCalledTimes(1);
    expect(errorHandler).toHaveBeenCalledWith(mockError);
  });

  test('merges karma getServerSideProps with handlers result', async () => {
    setupSpies();

    const mockHandler = jest.fn().mockResolvedValueOnce({ props: mockProps });
    const getServerSideProps = withKarmaSSRProps(mockHandler);
    const result = await getServerSideProps(mockCtx);

    expect(result).toStrictEqual({
      props: {
        karma: {
          auth: {
            session: null,
          },
          cookies: '',
          i18n: {
            locale: FALLBACK_LANGUAGE,
            resources: {
              [FALLBACK_LANGUAGE]: i18nCache[FALLBACK_LANGUAGE],
            },
          },
        },
        ...mockProps,
      },
    });
  });
});
