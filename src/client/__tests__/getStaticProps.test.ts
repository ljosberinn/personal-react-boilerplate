import type { GetStaticPropsContext } from 'next';

import { i18nCache } from '../../../testUtils/i18n';
import { FALLBACK_LANGUAGE, ENABLED_LANGUAGES } from '../../constants';
import type { Namespace } from '../../constants';
import {
  createGetStaticProps,
  getStaticProps,
  withKarmaSSGProps,
} from '../karma/getStaticProps';
import * as i18n from '../karma/i18n';

const locale = ENABLED_LANGUAGES.find((lng) => lng !== FALLBACK_LANGUAGE)!;

const mockCtx: GetStaticPropsContext = {
  locale,
};

describe('getStaticProps', () => {
  describe('i18n', () => {
    test('defaults to FALLBACK_LANGUAGE and the full bundle without namespaces', async () => {
      const result = await getStaticProps({});

      expect(result).toStrictEqual({
        props: {
          karma: {
            auth: {
              redirectDestinationIfUnauthenticated: '',
              session: null,
              shouldAttemptReauthentication: false,
            },
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

    test('defaults to FALLBACK_LANGUAGE and a partial bundle given namespaces', async () => {
      const namespaces: Namespace[] = ['theme'];
      const result = await getStaticProps({}, { i18n: { namespaces } });

      expect(result).toStrictEqual({
        props: {
          karma: {
            auth: {
              redirectDestinationIfUnauthenticated: '',
              session: null,
              shouldAttemptReauthentication: false,
            },
            i18n: {
              locale: FALLBACK_LANGUAGE,
              resources: {
                [FALLBACK_LANGUAGE]: {
                  theme: i18nCache[FALLBACK_LANGUAGE].theme,
                },
              },
            },
          },
        },
      });
    });

    test('given a language, loads the entire bundle given no namespaces', async () => {
      const result = await getStaticProps({
        locale,
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
              locale,
              resources: {
                [locale]: i18nCache[locale],
              },
            },
          },
        },
      });
    });

    test('given a language, loads a bundle given namespaces', async () => {
      const namespaces: Namespace[] = ['theme'];

      const result = await getStaticProps(mockCtx, {
        i18n: {
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
              locale,
              resources: {
                [locale]: {
                  theme: i18nCache[locale].theme,
                },
              },
            },
          },
        },
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
  describe('i18n', () => {
    test('forwards namespaces onto getI18n', async () => {
      const getI18nSpy = jest.spyOn(i18n, 'getI18n');

      await createGetStaticProps({
        i18n: {
          namespaces: [],
        },
      })({});

      expect(getI18nSpy).toHaveBeenCalledWith(
        FALLBACK_LANGUAGE,
        expect.objectContaining({
          namespaces: [],
        })
      );
    });
  });
});

describe('withKarmaSSGProps', () => {
  const mockProps = { foo: 1 };

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
    const result = await getStaticProps({});

    expect(result).toStrictEqual({
      props: {
        karma: {
          auth: {
            redirectDestinationIfUnauthenticated: '',
            session: null,
            shouldAttemptReauthentication: false,
          },
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
