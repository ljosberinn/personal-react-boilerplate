import { render } from '@testing-library/react';
import { GetServerSidePropsContext } from 'next';
import React from 'react';

import {
  makeMockIncomingRequest,
  makeMockServerResponse,
} from '../../testUtils/api';
import * as cookieUtils from '../server/auth/cookie';
import { i18nCache } from '../server/i18n/cache';
import * as detectLanguageUtils from '../server/i18n/detectLanguage';
import * as sentryUtils from '../utils/sentry/client';
import {
  KarmaProvider,
  KarmaProps,
  getServerSideProps,
  withServerSideKarmaProps,
} from './Karma';
import * as i18n from './i18n';

const defaultProps: KarmaProps = {
  cookies: '',
  i18nBundle: i18nCache.de,
  language: 'en',
  session: null,
};

describe('<KarmaProvider />', () => {
  it('renders without crashing given default props', () => {
    render(<KarmaProvider {...defaultProps}>next-karma</KarmaProvider>);
  });

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

    render(<KarmaProvider {...defaultProps}>next-karma</KarmaProvider>);

    expect(attachComponentBreadcrumbSpy).toHaveBeenCalledWith('KarmaProvider');
  });
});

const mockCtx: GetServerSidePropsContext = {
  query: {},
  req: makeMockIncomingRequest(),
  res: makeMockServerResponse(),
};

const mockLanguage = 'en';
const mockBundle = i18nCache.en;

const setupSpies = () => {
  const getSessionSpy = jest
    .spyOn(cookieUtils, 'getSession')
    .mockImplementationOnce(() => null);
  const getI18NSpy = jest
    .spyOn(i18n, 'getI18N')
    .mockResolvedValueOnce(mockBundle);
  const detectLanguageSpy = jest
    .spyOn(detectLanguageUtils, 'detectLanguage')
    .mockImplementationOnce(() => mockLanguage);

  const attachInitialContextSpy = jest.spyOn(
    sentryUtils,
    'attachInitialContext'
  );

  return {
    attachInitialContextSpy,
    detectLanguageSpy,
    getI18NSpy,
    getSessionSpy,
  };
};

const setup = async () => {
  const spies = setupSpies();

  const result = await getServerSideProps(mockCtx);

  return {
    result,
    ...spies,
  };
};

describe('getServerSideProps', () => {
  test('attaches initial context', async () => {
    const { attachInitialContextSpy } = await setup();

    expect(attachInitialContextSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        language: mockLanguage,
        req: mockCtx.req,
        session: null,
      })
    );
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

    expect(getI18NSpy).toHaveBeenCalledWith(mockLanguage, mockCtx.req);
  });

  test('matches expected shape', async () => {
    const { result } = await setup();

    expect(result).toMatchObject({
      props: {
        karma: expect.objectContaining({
          cookies: '',
          i18nBundle: mockBundle,
          language: mockLanguage,
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
          language: mockLanguage,
          session: null,
        },
        ...mockProps,
      }),
    });
  });
});
