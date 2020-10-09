import * as sentryReact from '@sentry/react';
import type { GetStaticPropsContext } from 'next';
import React from 'react';

import { render } from '../../../testUtils';
import type { Namespace } from '../../constants';
import { ENABLED_LANGUAGES, FALLBACK_LANGUAGE } from '../../constants';
import { i18nCache } from '../../server/i18n/cache';
import * as sentryUtils from '../../utils/sentry/client';
import type { KarmaSSGProps } from '../Karma';
import {
  withKarmaSSGProps,
  getStaticProps,
  KarmaSSG,
  createGetStaticProps,
} from '../Karma';
import * as i18n from '../i18n';

describe('<KarmaSSG />', () => {
  const defaultProps: KarmaSSGProps = {
    auth: {
      session: null,
    },
    i18n: {
      bundle: i18nCache.de,
      language: 'en',
    },
  };

  test('Core initializes i18next', () => {
    const initI18NSpy = jest.spyOn(i18n, 'initI18Next');

    render(<KarmaSSG {...defaultProps}>next-karma</KarmaSSG>, {
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

    render(<KarmaSSG {...defaultProps}>next-karma</KarmaSSG>, {
      omitKarmaProvider: true,
    });

    expect(attachComponentBreadcrumbSpy).toHaveBeenCalledWith('KarmaSSG');
    expect(addBreadcrumbSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        level: expect.any(String),
        message: expect.any(String),
      })
    );
  });
});

const mockCtx: GetStaticPropsContext = {};

describe('getStaticProps', () => {
  describe('i18n', () => {
    test('defaults to FALLBACK_LANGUAGE and the full bundle without namespaces', async () => {
      const result = await getStaticProps(mockCtx);

      expect(result).toStrictEqual({
        props: {
          karma: {
            auth: {
              redirectDestinationIfUnauthenticated: '',
              session: null,
              shouldAttemptReauthentication: false,
            },
            i18n: {
              bundle: i18nCache[FALLBACK_LANGUAGE],
              language: FALLBACK_LANGUAGE,
            },
          },
        },
        revalidate: undefined,
      });
    });

    test('defaults to FALLBACK_LANGUAGE and a partial bundle given namespaces', async () => {
      const namespaces: Namespace[] = ['theme'];
      const result = await getStaticProps(mockCtx, { i18n: { namespaces } });

      expect(result).toStrictEqual({
        props: {
          karma: {
            auth: {
              redirectDestinationIfUnauthenticated: '',
              session: null,
              shouldAttemptReauthentication: false,
            },
            i18n: {
              bundle: {
                theme: i18nCache[FALLBACK_LANGUAGE].theme,
              },
              language: FALLBACK_LANGUAGE,
            },
          },
        },
        revalidate: undefined,
      });
    });

    test('given a language, loads the entire bundle given no namespaces', async () => {
      const language = ENABLED_LANGUAGES.find(
        (lng) => lng !== FALLBACK_LANGUAGE
      )!;

      const result = await getStaticProps(mockCtx, {
        i18n: {
          language,
        },
      });

      expect(result).toStrictEqual({
        props: {
          karma: {
            auth: {
              redirectDestinationIfUnauthenticated: '',
              session: null,
              shouldAttemptReauthentication: false,
            },
            i18n: {
              bundle: i18nCache[language],
              language,
            },
          },
        },
        revalidate: undefined,
      });
    });

    test('given a language, loads a bundle given namespaces', async () => {
      const language = ENABLED_LANGUAGES.find(
        (lng) => lng !== FALLBACK_LANGUAGE
      )!;
      const namespaces: Namespace[] = ['theme'];

      const result = await getStaticProps(mockCtx, {
        i18n: {
          language,
          namespaces,
        },
      });

      expect(result).toStrictEqual({
        props: {
          karma: {
            auth: {
              redirectDestinationIfUnauthenticated: '',
              session: null,
              shouldAttemptReauthentication: false,
            },
            i18n: {
              bundle: {
                theme: i18nCache[language].theme,
              },
              language,
            },
          },
        },
        revalidate: undefined,
      });
    });
  });

  describe('auth', () => {
    test('by default, does not attempt to initialize reauthentication', async () => {
      const result = await getStaticProps(mockCtx);

      expect(result.props.karma.auth.shouldAttemptReauthentication).toBe(false);
    });

    test('by default, does not attempt to redirectDestinationIfUnauthenticated', async () => {
      const result = await getStaticProps(mockCtx);

      expect(result.props.karma.auth.redirectDestinationIfUnauthenticated).toBe(
        ''
      );
    });

    test('forwards given shouldAttemptReauthentication boolean', async () => {
      const shouldAttemptReauthentication = true;

      const result = await getStaticProps(mockCtx, {
        auth: {
          shouldAttemptReauthentication,
        },
        i18n: { namespaces: [] },
      });

      expect(result.props.karma.auth.shouldAttemptReauthentication).toBe(
        shouldAttemptReauthentication
      );
    });

    test('forwards given redirectDestinationIfUnauthenticated string', async () => {
      const redirectDestinationIfUnauthenticated = '/foo';

      const result = await getStaticProps(mockCtx, {
        auth: {
          redirectDestinationIfUnauthenticated,
        },
        i18n: { namespaces: [] },
      });

      expect(result.props.karma.auth.redirectDestinationIfUnauthenticated).toBe(
        redirectDestinationIfUnauthenticated
      );
    });
  });
});

describe('createGetStaticProps', () => {
  test('returns a function', () => {
    expect(createGetStaticProps({})).toBeInstanceOf(Function);
  });

  describe('i18n', () => {
    test('forwards namespaces onto getI18n', async () => {
      const getI18nSpy = jest.spyOn(i18n, 'getI18n');

      await createGetStaticProps({
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

    test('forwards language onto getI18n', async () => {
      const language = ENABLED_LANGUAGES.find(
        (lng) => lng !== FALLBACK_LANGUAGE
      )!;

      const getI18nSpy = jest.spyOn(i18n, 'getI18n');

      await createGetStaticProps({
        i18n: {
          language,
        },
      })(mockCtx);

      expect(getI18nSpy).toHaveBeenCalledWith(language, {
        namespaces: undefined,
      });
    });
  });
});

describe('withKarmaSSGProps', () => {
  const mockProps = { foo: 1 };

  test('returns a function', () => {
    const getStaticProps = withKarmaSSGProps(jest.fn());

    expect(getStaticProps).toBeInstanceOf(Function);
  });

  test('executes given handler, forwarding context', async () => {
    const mockHandler = jest.fn().mockResolvedValueOnce({ props: mockProps });
    const getStaticProps = withKarmaSSGProps(mockHandler);

    await getStaticProps(mockCtx);

    expect(mockHandler).toHaveBeenCalledWith(mockCtx);
  });

  test('bubbles errors', async () => {
    const mockError = new Error('error');
    const mockHandler = jest.fn().mockImplementationOnce(() => {
      throw mockError;
    });
    const getStaticProps = withKarmaSSGProps(mockHandler);

    const errorHandler = jest.fn();

    try {
      await getStaticProps(mockCtx);
    } catch (error) {
      errorHandler(error);
    }

    expect(errorHandler).toHaveBeenCalledTimes(1);
    expect(errorHandler).toHaveBeenCalledWith(mockError);
  });

  test('merges karma getStaticProps with handlers result', async () => {
    const mockHandler = jest.fn().mockResolvedValueOnce({ props: mockProps });
    const getStaticProps = withKarmaSSGProps(mockHandler);
    const result = await getStaticProps(mockCtx);

    expect(result).toStrictEqual({
      props: {
        karma: {
          auth: {
            redirectDestinationIfUnauthenticated: '',
            session: null,
            shouldAttemptReauthentication: false,
          },
          i18n: {
            bundle: i18nCache[FALLBACK_LANGUAGE],
            language: FALLBACK_LANGUAGE,
          },
        },
        ...mockProps,
      },
      revalidate: undefined,
    });
  });
});
